import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user"; // Adjust the path as necessary
import { rootCertificates } from "tls";

// Login logic (direct in the controller)
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

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

    // Optionally, generate a JWT token if you decide to implement token-based authentication
    // const token = jwt.sign({ id: user._id, username: user.username }, 'yourSecretKey', { expiresIn: '1h' });

    // Return success response (JWT can be included if you use token-based authentication)
    res
      .status(200)
      .json({ message: "Login successful", username: user.username, role : user.roles });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
