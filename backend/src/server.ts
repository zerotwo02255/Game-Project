import express from "express";
import cors from "cors";
import pool from "./db/pool.js";
import gameRoutes from "./routes/gameRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Game-project backend is running!",
  });
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/api/games", gameRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});