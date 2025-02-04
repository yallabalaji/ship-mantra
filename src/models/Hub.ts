import { Schema, model, Document } from "mongoose";

interface IHub extends Document {
  hubCode: string;
  hubName: string;
  hubCity: string;
  isCentral: boolean;
  createdAt: Date;
}

const hubSchema = new Schema<IHub>({
  hubCode: {
    type: String,
    required: true,
    unique: true,
  },
  hubName: {
    type: String,
    required: true,
  },
  hubCity: {
    type: String,
    required: true,
  },
  isCentral: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hub = model<IHub>("Hub", hubSchema);

// Composite unique index for hubCode and hubCity combination
hubSchema.index({ hubCode: 1, hubName: 1, hubCity: 1 }, { unique: true });

export default Hub;
