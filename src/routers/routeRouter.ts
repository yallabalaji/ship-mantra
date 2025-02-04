import { Router } from "express";
import {
  createRoute,
  findRoutesBetweenHubs,
} from "../controllers/routeController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Route:
 *       type: object
 *       required:
 *         - routeName
 *         - sourceCity
 *         - destinationCity
 *         - hubs
 *       properties:
 *         routeName:
 *           type: string
 *           description: The name of the route
 *         sourceCity:
 *           type: string
 *           description: The source city for the route
 *         destinationCity:
 *           type: string
 *           description: The destination city for the route
 *         hubs:
 *           type: array
 *           items:
 *             type: string
 *             description: List of hub IDs associated with the route
 *           description: A list of hubs for the route
 *       example:
 *         routeName: "Route 101"
 *         sourceCity: "New York"
 *         destinationCity: "Los Angeles"
 *         hubs: ["abc123", "def456", "ghi789"]
 *
 * /routes/create:
 *   post:
 *     summary: Create a new route
 *     tags:
 *       - Routes
 *     requestBody:
 *       description: Route object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /routes/find-routes:
 *   post:
 *     summary: Find routes between two hubs
 *     description: Returns all possible routes and the shortest route between the source and destination hubs.
 *     tags:
 *       - Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sourceHub:
 *                 type: string
 *                 description: ID of the source hub
 *               destinationHub:
 *                 type: string
 *                 description: ID of the destination hub
 *             required:
 *               - sourceHub
 *               - destinationHub
 *     responses:
 *       200:
 *         description: Successful response with all routes and the shortest route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 graph:
 *                   type: object
 *                   description: The graph structure representing the connections between hubs.
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 allRoutes:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: string
 *                   description: All possible routes between the source and destination hubs.
 *                 shortestRoute:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The shortest route between the source and destination hubs.
 *                 hubDetails:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the hub.
 *                       city:
 *                         type: string
 *                         description: The city where the hub is located.
 *       400:
 *         description: Bad request. Source and destination hubs are required.
 *       500:
 *         description: Internal server error.
 */

router.post("/create", createRoute);
router.post("/find-routes", findRoutesBetweenHubs);

export default router;
