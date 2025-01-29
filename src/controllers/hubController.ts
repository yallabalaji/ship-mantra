import { Request, Response } from "express";
import Hub from "../models/Hub"; // Assuming Hub model is in models/hub.ts

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
