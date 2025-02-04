import { Route } from "../models/Route";
import Hub from "../models/Hub";

interface Graph {
  [key: string]: string[];
}

// Initialize graph
let graph: Graph = {};

// Build the graph by looping through all routes
export const buildGraph = async () => {
  const routes = await Route.find({}).populate("hubs"); // Fetch all routes with populated hubs

  // Clear the existing graph to avoid old data
  graph = {};

  // Iterate over each route
  for (const route of routes) {
    // Iterate over the hubs within each route
    for (let i = 0; i < route.hubs.length - 1; i++) {
      const currentHub = await Hub.findById(route.hubs[i]); // Get the current hub's city
      const currentHubCity = currentHub?.hubCity; // Get the current hub's city
      const nextHub = await Hub.findById(route.hubs[i + 1]); // Get the next hub's city
      const nextHubCity = nextHub?.hubCity; // Get the next hub's city

      // If the current hub doesn't exist in the graph, create an empty list
      if (currentHubCity && !graph[currentHubCity]) {
        graph[currentHubCity] = [];
      }

      // If the next hub doesn't exist in the graph, create an empty list
      if (nextHubCity && !graph[nextHubCity]) {
        graph[nextHubCity] = [];
      }

      // Add bidirectional connections: current -> next and next -> current
      if (currentHubCity && nextHubCity) {
        if (!graph[currentHubCity].includes(nextHubCity)) {
          graph[currentHubCity].push(nextHubCity);
        }
        if (!graph[nextHubCity].includes(currentHubCity)) {
          graph[nextHubCity].push(currentHubCity);
        }
      }
    }
  }

  console.log("Graph Updated:", graph); // Debugging log
};

// Function to get routes between cities using BFS
export const getRoutesBetweenCities = async (
  source: string,
  destination: string
): Promise<{
  route: string[];
  hubs: { name: string; code: string }[];
} | null> => {
  // If the source or destination does not exist in the graph, return null
  if (!graph[source] || !graph[destination]) {
    return Promise.resolve(null);
  }

  // BFS to find the shortest path
  const queue: { route: string[]; hubs: { name: string; code: string }[] }[] = [
    { route: [source], hubs: [{ name: source, code: "" }] },
  ]; // Store routes as arrays of cities with corresponding hubs (name and code)
  const visited: Set<string> = new Set(); // Track visited cities

  visited.add(source);

  while (queue.length > 0) {
    const currentRouteData = queue.shift()!; // Get the next route
    const currentRoute = currentRouteData.route;
    const currentHubs = currentRouteData.hubs;
    const currentCity = currentRoute[currentRoute.length - 1]; // Get the last city in the route

    // If the destination is reached, return the route and hubs
    if (currentCity === destination) {
      return Promise.resolve({
        route: currentRoute,
        hubs: currentHubs,
      });
    }

    // Explore neighbors of the current city
    for (const neighbor of graph[currentCity]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);

        // Fetch hub details (name and code) for the neighboring city
        const hubDetails = await Hub.findOne({ hubCity: neighbor }); // Assuming hubCity is unique
        const hubName = hubDetails?.hubName || "N/A"; // Default hub name if not found
        const hubCode = hubDetails?.hubCode || "N/A"; // Default hub code if not found

        queue.push({
          route: [...currentRoute, neighbor], // Add new city to the route
          hubs: [...currentHubs, { name: neighbor, code: hubCode }], // Add the connected hub (name and code)
        });
      }
    }
  }

  // If no route is found, return null
  return null;
};

// Function to update the graph by rebuilding it
export const updateGraph = async () => {
  // Rebuild the graph from scratch by fetching the latest data
  await buildGraph();
};

export { graph };
