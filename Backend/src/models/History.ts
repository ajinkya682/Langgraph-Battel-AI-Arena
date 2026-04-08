import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  prompt: string;
  solution1: string;
  solution2: string;
  judge: {
    solution1_score: number;
    solution2_score: number;
    solution1_reasoning: string;
    solution2_reasoning: string;
  };
  createdAt: Date;
}

const HistorySchema: Schema = new Schema(
  {
    prompt: { type: String, required: true },
    solution1: { type: String, required: true },
    solution2: { type: String, required: true },
    judge: {
      solution1_score: { type: Number, required: true },
      solution2_score: { type: Number, required: true },
      solution1_reasoning: { type: String, required: true },
      solution2_reasoning: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IHistory>("History", HistorySchema);
