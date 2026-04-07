import dotenv from "dotenv";
dotenv.config();

type CONFIG = {
  readonly MISTRAL_API_KEY: string;
  readonly GOOGLE_API_KEY: string;
  readonly COHERE_API_KEY: string;
};

const config: CONFIG = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
};

export default config;
