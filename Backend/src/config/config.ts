import dotenv from "dotenv";

dotenv.config();

type CONFIG = {
  readonly GOOGLE_API_KEY: string;
  readonly MISTAL_API_KEY: string;
  readonly COHERE_API_KEY: string;
};

const config: CONFIG = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  MISTAL_API_KEY: process.env.MISTAL_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
};

export default config;
