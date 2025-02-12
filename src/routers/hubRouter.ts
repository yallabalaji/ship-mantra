import express from "express";
import {
  createHub,
  getAllHubs,
  getHubsByCity,
  getValidCities,
} from "../controllers/hubController";

import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Hub Management
 *     description: Routes related to Hub Management
 */

/**
 * @swagger
 * /hub/createhub:
 *   post:
 *     tags: [Hub Management]
 *     summary: Create a new hub
 *     security:
 *       - BearerAuth: []
 *     description: Creates a new hub with the specified properties.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hubCode:
 *                 type: string
 *                 description: The code of the hub
 *                 example: "HUB001"
 *               hubName:
 *                 type: string
 *                 description: The name of the hub
 *                 example: "Central Hub"
 *               hubCity:
 *                 type: string
 *                 description: The city of the hub
 *                 example: "New York"
 *               isCentral:
 *                 type: boolean
 *                 description: Whether the hub is central
 *                 example: true
 *     responses:
 *       201:
 *         description: Hub created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hub created successfully"
 *                 hub:
 *                   type: object
 *                   properties:
 *                     hubCode:
 *                       type: string
 *                       example: "HUB001"
 *                     hubName:
 *                       type: string
 *                       example: "Central Hub"
 *                     hubCity:
 *                       type: string
 *                       example: "New York"
 *                     isCentral:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "hubCode, hubName, and hubCity are required"
 */
router.post("/createhub", verifyToken, authorizeRole(["RoutePlanner"]), createHub);

/**
 * @swagger
 * /hub/allhubs:
 *   get:
 *     tags: [Hub Management]
 *     summary: Get a list of all hubs
 *     security:
 *       - BearerAuth: []
 *     description: This endpoint fetches all the hubs created in the system.
 *     responses:
 *       200:
 *         description: A list of hubs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hubCode:
 *                     type: string
 *                     example: "VSKP01"
 *                   hubCity:
 *                     type: string
 *                     example: "Visakhapatnam"
 *       404:
 *         description: "No hubs found"
 *       500:
 *         description: Internal server error
 */
router.get("/allhubs", verifyToken, authorizeRole(["RouteUser","RoutePlanner"]), getAllHubs);

/**
 * @swagger
 * /hub/available:
 *   get:
 *     summary: Get available hubs for a given city
 *     security:
 *       - BearerAuth: []
 *     tags: [Hub Management]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The city name to filter hubs.
 *     responses:
 *       200:
 *         description: List of available hubs for the city.
 *       400:
 *         description: City parameter is missing.
 *       404:
 *         description: No hubs found for the city.
 *       500:
 *         description: Internal server error.
 */
router.get("/available",  verifyToken, authorizeRole(["RouteUser","RoutePlanner"]), getHubsByCity);

/**
 * @swagger
 * /hub/valid-cities:
 *   get:
 *     tags:
 *       - Hub Management
 *     summary: Get all available cities with registered hubs for route planning
 *     security:
 *       - BearerAuth: []
 *     description: Fetches all cities where hubs are registered for route planning, without requiring state validation.
 *     responses:
 *       200:
 *         description: Successfully fetched available cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Available cities fetched successfully"
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["New York", "San Francisco", "Los Angeles"]
 *       500:
 *         description: Internal Server Error.
 */
router.get("/valid-cities",  verifyToken, authorizeRole(["RouteUser","RoutePlanner"]), getValidCities);

export default router;
