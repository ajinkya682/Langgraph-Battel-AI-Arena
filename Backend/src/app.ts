import express from "express";
import cors from "cors";
import runGraph from "./services/ai.js";
import connectDB from "./config/database.js";
import History from "./models/History.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const result = await runGraph(prompt);

    // Save to history
    const history = new History({
      prompt: result.problem,
      solution1: result.solution_1,
      solution2: result.solution_2,
      judge: {
        solution1_score: result.judge.solution_1_score,
        solution2_score: result.judge.solution_2_score,
        solution1_reasoning: result.judge.solution_1_reasoning,
        solution2_reasoning: result.judge.solution_2_reasoning,
      },
    });
    await history.save();

    res.json(result);
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

export default app;
