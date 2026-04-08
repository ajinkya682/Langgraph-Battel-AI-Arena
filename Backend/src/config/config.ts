import dotenv from "dotenv";
dotenv.config();

type CONFIG = {
  readonly MISTRAL_API_KEY: string;
  readonly GOOGLE_API_KEY: string;
  readonly COHERE_API_KEY: string;
  readonly MONGO_URI: string;
};

// Support common env var names so deployments don't silently fall back to localhost.
const mongoUriFromEnv =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "";

const config: CONFIG = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  MONGO_URI:
    mongoUriFromEnv || "mongodb://127.0.0.1:27017/langgraph-battle-ai",
};

export default config;
