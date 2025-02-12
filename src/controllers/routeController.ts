import { Request, Response, NextFunction } from "express";
import { Route } from "../models/Route";
import Hub from "../models/Hub";
import { getRoutesBetweenCities } from "../utils/oldVersiongraph";
import {
  buildGraph,
  findAllRoutes,
  getShortestRoute,
  addDefaultRoutesForCityHubs,
} from "../utils/Graph";

export const createRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const { hubs, sourceCity, destinationCity, routeName, intermediateCities } =
      req.body;

    if (!routeName || !hubs || !Array.isArray(hubs) || hubs.length < 2) {
      res.status(400).json({
        message: "Route name and at least two valid hubs are required",
      });
      return;
    }

    // Fetch all hubs to verify existence
    const allHubs = await Hub.find({}, "_id name city").lean();
    const validHubIds = new Set(allHubs.map((hub) => hub._id.toString()));

    console.log("Valid Hub IDs:", validHubIds);

    // Validate provided hub IDs
    for (const hub of hubs) {
      if (!validHubIds.has(hub)) {
        res.status(400).json({ message: `Invalid hub ID: ${hub}` });
        return;
      }
    }

    // Create and save the route
    const newRoute = new Route({
      routeName,
      hubs,
      sourceCity,
      destinationCity,
      intermediateCities: intermediateCities || [],
    });

    await newRoute.save();

    res.status(201).json({
      message: "Route created successfully",
      route: newRoute,
    });
  } catch (error) {
    next(error);
  }
};




/**
 * Controller to find all routes between source and destination hubs
 */
export const findRoutesBetweenHubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Destructure source and destination from request body or query params
    const { sourceHub, destinationHub } = req.body; // or req.query for query params

    if (!sourceHub || !destinationHub) {
      res
        .status(400)
        .json({ message: "Source and destination hubs are required" });
      return;
    }
    // Build the graph using the utility

    const { graph, groupedHubsByCity } = await buildGraph();

    // Find all possible routes between the source and destination hubs
    const allRoutes = findAllRoutes(graph, sourceHub, destinationHub);

    // Find the shortest route from the list of routes
    const shortestRoute = getShortestRoute(allRoutes);

    // Prepare the response
    const result = {
      graph, // Returning the graph structure
      allRoutes, // All possible routes
      shortestRoute, // Shortest route
      groupedHubsByCity, // Grouped hubs by city
    };

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error finding routes:", error);
    res.status(500).json({ message: "An error occurred while finding routes" });
    return;
  }
};

  // Controller to get all routes
  // Get All Hubs
  export const getAllRoutes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const routes = await Route.find();
      if (routes.length === 0) {
        res.status(404).json({ message: "No routes found" }); // If no hubs found
        return;
      }
      res.status(200).json(routes); // Return list of all hubs
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error: Unable to fetch routes." });
      return;
    }
  };