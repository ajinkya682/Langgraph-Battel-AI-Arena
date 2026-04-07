import express from "express";
import runGraph from "./services/ai.js";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const result = await runGraph("Write an code for Factorial function in js");

  res.json(result);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

export default app;
