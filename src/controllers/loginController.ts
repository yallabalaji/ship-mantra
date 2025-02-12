import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user"; // Adjust the path as necessary
 
// Login logic (direct in the controller)
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const jwt = require('jsonwebtoken');

    // Input validation: Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.roles }, // Store role in token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", username: user.username, role : user.roles , token });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
