import dotenv from "dotenv"

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
