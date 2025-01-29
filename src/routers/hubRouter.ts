import express from "express";
import {
  createHub,
  getAllHubs,
  getHubsByCity,
  getValidCities,
} from "../controllers/hubController";

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
 *     description: This endpoint creates a new hub with a unique code and city.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hubCode
 *               - hubCity
 *             properties:
 *               hubCode:
 *                 type: string
 *                 example: "VSKP01"
 *               hubCity:
 *                 type: string
 *                 example: "Visakhapatnam"
 *     responses:
 *       200:
 *         description: Hub created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hub created successfully"
 *       400:
 *         description: Invalid input or hub already exists
 *       500:
 *         description: Internal server error
 */
router.post("/createhub", createHub);

/**
 * @swagger
 * /hub/allhubs:
 *   get:
 *     tags: [Hub Management]
 *     summary: Get a list of all hubs
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
router.get("/allhubs", getAllHubs);

/**
 * @swagger
 * /hub/available:
 *   get:
 *     summary: Get available hubs for a given city
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
router.get("/available", getHubsByCity);

/**
 * @swagger
 * /hub/valid-cities:
 *   get:
 *     tags:
 *       - Hub Management
 *     summary: Get all available cities with registered hubs for route planning
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
router.get("/valid-cities", getValidCities);

export default router;
