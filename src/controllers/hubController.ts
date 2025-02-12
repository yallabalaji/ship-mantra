import { NextFunction, Request, Response } from "express";
import Hub from "../models/Hub";

// Create a Hub
export const createHub = async (req: Request, res: Response, next : NextFunction): Promise<void> => {
  const { hubCode, hubName, hubCity, isCentral } = req.body;

  // Check if the required fields are provided
  if (!hubCode || !hubCity) {
    res.status(400).json({ message: "hubCode and hubCity are required" });
  }

  try {
    // Check if the hub already exists with the same hubCode and hubCity
    const existingHub = await Hub.findOne({
      hubCode,
      hubName,
      hubCity,
      isCentral,
    });
    if (existingHub) {
      res.status(409).json({
        message:
          "Hub with the same hubCode , hubName and hubCity already exists.",
      });
    }

    const existingHubCode = await Hub.findOne({ hubCode });
    if (existingHubCode) {
      res.status(409).json({
        message: " Hub Code Already Exits. Please Use Unique One",
      });
    }

    const existingCentralHub = await Hub.findOne({ hubCity, isCentral: true });
    if (existingCentralHub && isCentral) {
      res.status(409).json({
        message: "Central Hub Already Exits for hubCity.",
      });
    }

    // Create a new Hub
    const newHub = new Hub({
      hubCode,
      hubName,
      hubCity,
      isCentral,
    });

    // Save the hub to the database
    const savedHub = await newHub.save();

    // Return the saved hub as a response
    res.status(201).json(savedHub);
  } catch (error) {
    // If there's any error during the process, send an internal server error
    console.error(error);
    next(error);
    res.status(500).json({ message: "Server Error: Unable to create hub." });
  }
};

// Get All Hubs
export const getAllHubs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hubs = await Hub.find();
    if (hubs.length === 0) {
      res.status(404).json({ message: "No hubs found" }); // If no hubs found
      
    }
    res.status(200).json(hubs); // Return list of all hubs
    
  } catch (error) {
    console.error(error);
    next(error);
    res.status(500).json({ message: "Server Error: Unable to fetch hubs." });
    
  }
};
// function get hubs by city
export const getHubsByCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city } = req.query;
    if (!city) {
      res.status(400).json({ message: "City parameter is required" });
      
    }

    const hubs = await Hub.find({ hubCity: city?.toString() || '' });
    if (hubs.length === 0) {
      res.status(404).json({ message: "No hubs found for the selected city" });
      
    }

    const hubNames = hubs.map(hub => hub.hubName); // Extract hub names

    res.status(200).json(hubNames); // Return the array of hub names
    
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error", error });
    
  }
};

// Function to get valid city names where hubs are registered
export const getValidCities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hubs = await Hub.find().distinct("hubCity"); // Fetch distinct cities from the Hub collection
    res.status(200).json(hubs); // Return the array of cities directly
    
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Error fetching available cities", error });
    
  }
};
