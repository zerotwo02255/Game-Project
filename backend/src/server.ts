import express from "express";
import cors from "cors";
import pool from "./db/pool.js";
import gameRoutes from "./routes/gameRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  searchRawgGames,
  getRawgGameById,
} from "./services/rawgService.js";
import path from "path";
import screenshotRoutes from "./routes/screenshotRoutes.js";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.resolve("uploads")),
);



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
app.use("/api/screenshots", screenshotRoutes);
app.use(errorHandler);

app.get("/api/rawg/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const games = await searchRawgGames(query);

    res.json(games);
  } catch (error) {
    console.error("RAWG search error:", error);

    res.status(500).json({
      message: "Failed to search games",
    });
  }
});

app.get("/api/rawg/games/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid game ID",
      });
    }

    const game = await getRawgGameById(id);

    res.json(game);
  } catch (error) {
    console.error("RAWG game details error:", error);

    res.status(500).json({
      message: "Failed to fetch game details",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});