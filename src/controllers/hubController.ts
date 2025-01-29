import { Request, Response } from "express";
import Hub from "../models/Hub";

// Create a Hub
export const createHub = async (req: Request, res: Response): Promise<void> => {
  const { hubCode, hubCity } = req.body;

  // Check if the required fields are provided
  if (!hubCode || !hubCity) {
    res.status(400).json({ message: "hubCode and hubCity are required" });
    return;
  }

  try {
    // Check if the hub already exists with the same hubCode and hubCity
    const existingHub = await Hub.findOne({ hubCode, hubCity });
    if (existingHub) {
      res.status(409).json({
        message: "Hub with the same hubCode and hubCity already exists.",
      });
      return;
    }

    // Create a new Hub
    const newHub = new Hub({
      hubCode,
      hubCity,
    });

    // Save the hub to the database
    const savedHub = await newHub.save();

    // Return the saved hub as a response
    res.status(201).json(savedHub);
    return;
  } catch (error) {
    // If there's any error during the process, send an internal server error
    console.error(error);
    res.status(500).json({ message: "Server Error: Unable to create hub." });
    return;
  }
};

// Get All Hubs
export const getAllHubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hubs = await Hub.find();
    if (hubs.length === 0) {
      res.status(404).json({ message: "No hubs found" }); // If no hubs found
      return;
    }
    res.status(200).json(hubs); // Return list of all hubs
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error: Unable to fetch hubs." });
    return;
  }
};
// function get hubs by city
export const getHubsByCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.query;
    if (!city) {
      res.status(400).json({ message: "City parameter is required" });
      return;
    }

    const hubs = await Hub.find({ hubCity: city.toString() });
    if (hubs.length === 0) {
      res.status(404).json({ message: "No hubs found for the selected city" });
      return;
    }

    res.status(200).json({ hubs });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};

// Function to get valid city names where hubs are registered
export const getValidCities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Using aggregate to get unique city names where hubs are available
    const cities = await Hub.aggregate([
      { $group: { _id: "$hubCity" } }, // Group by hubCity
      { $project: { city: "$_id", _id: 0 } }, // Project to return city name only
    ]);
    // Return the cities
    res.status(200).json({
      message: "Available cities fetched successfully",
      cities: cities.map((city) => city.city),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available cities", error });
  }
};
