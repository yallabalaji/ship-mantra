import { Router } from "express";
import {
  createRoute,
  findRoutesBetweenHubs,
  getAllRoutes,
  getAllRoutesPagination
} from "../controllers/routeController";

import { verifyToken, authorizeRole } from "../middleware/authMiddleware";

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
 *         routeName: "HYD VSKP Express"
 *         sourceCity: "Hyderabad"
 *         destinationCity: "Visakhapatnam"
 *         hubs: ["abc123", "def456", "ghi789"]
 *
 * /routes/create:
 *   post:
 *     summary: Create a new route
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Routes
 *     responses:
 *       200:
 *         description: A list of all routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Route'
 *       404:
 *         description: No routes found
 *       500:
 *         description: Internal server error
 */

router.post("/create",verifyToken, authorizeRole(["RoutePlanner"]), createRoute);
router.post("/find-routes", verifyToken, authorizeRole(["RouteUser","RoutePlanner"]), findRoutesBetweenHubs);
router.get("/",  verifyToken, authorizeRole(["RouteUser","RoutePlanner"]),getAllRoutes);


/**
 * @swagger
 * /routes/routesPagination:
 *   get:
 *     summary: Get paginated list of all routes
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Routes
 *     description: Fetches routes with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of routes per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully fetched routes
 *       404:
 *         description: No routes found
 *       500:
 *         description: Server error
 */
router.get("/routesPagination", verifyToken, authorizeRole(["RouteUser","RoutePlanner"]), getAllRoutesPagination);

export default router;
