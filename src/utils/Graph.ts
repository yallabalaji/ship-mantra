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

  // Fetch the list of distinct cities from the Hub collection
  const cities = await Hub.distinct("hubCity"); // Fetch distinct cities from the Hub collection

  const graph: Record<string, string[]> = {};
  const cityCentralHubs: Record<string, string> = {}; // Map of city to its central hub

  // Fetch all hubs to ensure every hub is at least initialized in the graph
  const allHubs = await Hub.find({});
  for (const hub of allHubs) {
    if (hub?.hubName && !graph[hub.hubName]) {
      graph[hub.hubName] = []; // Initialize empty array for each hub
    }
  }
  
  // Fetch central hubs for each city
  for (const city of cities) {
    const centralHub = await Hub.findOne({ hubCity: city, isCentral: true });
    if (centralHub?.hubName) {
      cityCentralHubs[city] = centralHub.hubName;
    }
  }
  
  // Iterate over each route to build connections
  for (const route of routes) {
    for (let i = 0; i < route.hubs.length - 1; i++) {
      const currentHub = await Hub.findById(route.hubs[i]);
      const nextHub = await Hub.findById(route.hubs[i + 1]);
  
      if (!currentHub?.hubName || !nextHub?.hubName) continue; // Skip if any hub is undefined
  
      // Ensure hubs exist in graph
      if (!graph[currentHub.hubName]) graph[currentHub.hubName] = [];
      if (!graph[nextHub.hubName]) graph[nextHub.hubName] = [];
  
      // Add bidirectional connection
      if (!graph[currentHub.hubName].includes(nextHub.hubName)) {
        graph[currentHub.hubName].push(nextHub.hubName);
      }
      if (!graph[nextHub.hubName].includes(currentHub.hubName)) {
        graph[nextHub.hubName].push(currentHub.hubName);
      }
    }
  }
  
  // Add internal hub-to-central hub connections for each city
  for (const city of cities) {
    const centralHubName = cityCentralHubs[city];
  
    if (!centralHubName) continue; // Skip cities without a central hub
  
    const hubsInCity = await Hub.find({ hubCity: city });
    for (const hub of hubsInCity) {
      if (!hub?.hubName || hub.hubName === centralHubName) continue;
  
      if (!graph[centralHubName]) graph[centralHubName] = [];
      if (!graph[hub.hubName]) graph[hub.hubName] = [];
  
      // Add bidirectional connection
      if (!graph[hub.hubName].includes(centralHubName)) {
        graph[hub.hubName].push(centralHubName);
      }
      if (!graph[centralHubName].includes(hub.hubName)) {
        graph[centralHubName].push(hub.hubName);
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
