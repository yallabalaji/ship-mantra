import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  sourceCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  intermediateCities: [{ type: String }], // Optional intermediate cities
  hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true }],
});

export const Route = mongoose.model("Route", RouteSchema);
