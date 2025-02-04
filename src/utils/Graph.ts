import Hub from "../models/Hub";
import { Route } from "../models/Route";

// Type for graph representation
interface Graph {
  [key: string]: string[];
}
let graph: Graph = {};

/**
 * Builds the graph where each hub is a node,
 * but hubs are grouped under their respective cities in the response.
 */
export const buildGraph = async () => {
  const routes = await Route.find({}).populate("hubs"); // Fetch all routes with populated hubs

  // Clear the existing graph to avoid old data
  graph = {};

  // Fetch the list of distinct cities from the Hub collection
  const cities = await Hub.distinct("hubCity"); // Fetch distinct cities from the Hub collection

  // Fetch central hubs dynamically from the database
  const cityCentralHubs: { [cityName: string]: string } = {};

  // Fetch central hubs for each city
  for (const city of cities) {
    const centralHub = await Hub.findOne({ hubCity: city, isCentral: true }); // Fetch central hub for the city
    if (centralHub) {
      cityCentralHubs[city] = centralHub.hubName; // Store the hubName of the central hub
    }
  }

  // Iterate over each route to build connections
  for (const route of routes) {
    // Iterate over the hubs within each route
    for (let i = 0; i < route.hubs.length - 1; i++) {
      const currentHub = await Hub.findById(route.hubs[i]); // Get the current hub's details
      const currentHubName = currentHub?.hubName;
      const nextHub = await Hub.findById(route.hubs[i + 1]); // Get the next hub's details
      const nextHubName = nextHub?.hubName;

      // If the current hub doesn't exist in the graph, create an empty list
      if (currentHubName && !graph[currentHubName]) {
        graph[currentHubName] = [];
      }

      // If the next hub doesn't exist in the graph, create an empty list
      if (nextHubName && !graph[nextHubName]) {
        graph[nextHubName] = [];
      }

      // Add bidirectional connections: current -> next and next -> current
      if (currentHubName && nextHubName) {
        if (!graph[currentHubName].includes(nextHubName)) {
          graph[currentHubName].push(nextHubName);
        }
        if (!graph[nextHubName].includes(currentHubName)) {
          graph[nextHubName].push(currentHubName);
        }
      }
    }
  }

  // Add internal hub-to-central hub connections for each city
  for (const city of cities) {
    const centralHubName = cityCentralHubs[city];

    // Fetch all hubs for the current city (except the central hub)
    const hubsInCity = await Hub.find({ hubCity: city }); // Fetch all hubs for this city
    const cityHubs = hubsInCity.filter((hub) => hub.hubName !== centralHubName);

    // Connect each city hub to the city's central hub
    for (const hub of cityHubs) {
      const hubName = hub.hubName;

      // Ensure the central hub and the current hub are bidirectionally connected
      if (!graph[centralHubName]) {
        graph[centralHubName] = [];
      }
      if (!graph[hubName]) {
        graph[hubName] = [];
      }

      // Add the connection
      if (!graph[hubName].includes(centralHubName)) {
        graph[hubName].push(centralHubName);
      }
      if (!graph[centralHubName].includes(hubName)) {
        graph[centralHubName].push(hubName);
      }
    }
  }

  // grouping all hubs by city name
  let groupedHubsByCity: { [key: string]: string[] } = {};
  for (const city of cities) {
    const hubs = await Hub.find({ hubCity: city }).exec();
    groupedHubsByCity[city] = hubs.map((hub) => hub.hubName);
  }

  console.log("Graph Updated:", graph); // Debugging log
  return { graph, groupedHubsByCity };
};

/**
 * Finds all possible routes between source and destination in a graph.
 */
export const findAllRoutes = (
  graph: Record<string, string[]>,
  source: string,
  destination: string
): string[][] => {
  const result: string[][] = [];
  const path: string[] = [];

  const dfs = (currentHub: string) => {
    path.push(currentHub);

    if (currentHub === destination) {
      result.push([...path]); // Store a copy of the current path
    } else {
      for (const neighbor of graph[currentHub] || []) {
        if (!path.includes(neighbor)) {
          // Avoid cycles
          dfs(neighbor);
        }
      }
    }

    path.pop(); // Backtrack
  };

  dfs(source);
  return result;
};

/**
 * Finds the shortest route from the list of all routes.
 */
export const getShortestRoute = (routes: string[][]): string[] | null => {
  if (routes.length === 0) return null;
  return routes.reduce((shortest, route) =>
    route.length < shortest.length ? route : shortest
  );
};

/**
 * This function ensures that all hubs in the same city are connected to their central hub.
 */
export const addDefaultRoutesForCityHubs = async (graph: {
  [key: string]: string[];
}) => {
  const hubs = await Hub.find();

  // Loop over each hub to create routes to its city central hub if necessary
  hubs.forEach(async (hub) => {
    // Skip if it's already a central hub
    if (!hub.isCentral) {
      //const centralHub =   await Hub.findOne({ hub.hubCity, isCentral: true }); // Find the central hub for this hub's city
      const centralHub = await Hub.findOne({
        city: hub.hubCity,
        isCentral: true,
      });

      if (centralHub) {
        // Ensure bidirectional routes between the hub and the central hub
        createRouteBetweenHubs(graph, hub.id, centralHub.id);
      }
    }
  });
};
/**
 * Ensures bidirectional routes between two hubs in the graph.
 */
function createRouteBetweenHubs(
  graph: { [key: string]: string[] },
  hubA: string,
  hubB: string
) {
  if (!graph[hubA]) {
    graph[hubA] = [];
  }
  if (!graph[hubB]) {
    graph[hubB] = [];
  }
  if (!graph[hubA].includes(hubB)) {
    graph[hubA].push(hubB);
  }
  if (!graph[hubB].includes(hubA)) {
    graph[hubB].push(hubA);
  }
}
