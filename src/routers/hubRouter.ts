import express from "express";
import { createHub, getAllHubs } from "../controllers/hubController";

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

export default router;
