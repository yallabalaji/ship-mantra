import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user"; // Assuming you have a User model defined

// Signup logic (direct in the controller)
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, roles } = req.body;

    // Input validation: Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      roles: roles || ["user"], // Default to 'user' role
    });

    // Save the user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
