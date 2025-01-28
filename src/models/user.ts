import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User model
interface IUser extends Document {
  username: string;
  password: string;
  roles: string[]; // Roles can be ['RoutePlanner', 'RouteUser', 'Admin']
}

// Create the User schema
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      required: true,
      enum: ["RoutePlanner", "RouteUser", "Admin"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
