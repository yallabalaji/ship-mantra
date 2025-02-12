import { Router } from "express";
import { login } from "../controllers/loginController";
import { signup } from "../controllers/signupController";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware";


const router = Router();

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: User Signup
 *     security:
 *       - BearerAuth: []
 *     description: Creates a new user account in the system.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/signIn", verifyToken, authorizeRole(["Admin"]), signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Allows a user to log in with their username and password.
 *     tags:
 *         - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

export default router;
