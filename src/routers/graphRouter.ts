import express, { Request, Response } from "express";
import { updateGraph } from "../utils/oldVersiongraph";

const router = express.Router();

/**
 * @swagger
 * /graph/update:
 *   get:
 *     tags:
 *       - Graph Building
 *     summary: Update the route graph
 *     description: Refreshes the graph data by rebuilding it from the database.
 *     responses:
 *       200:
 *         description: Graph updated successfully
 *       500:
 *         description: Server error while updating the graph
 */
router.get("/update", async (req: Request, res: Response): Promise<void> => {
  try {
    await updateGraph(); // Trigger graph update
    res.status(200).json({ message: "Graph updated successfully" });
    return;
  } catch (error) {
    console.error("Error updating graph:", error);
    res.status(500).json({ message: "Failed to update graph", error });
    return;
  }
});

export default router;
