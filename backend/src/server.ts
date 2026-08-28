import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();


const { Pool } = pg;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
   user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

app.get("/", (_req, res) => {
  res.json({
    message: "Game-project backend is running!",
  });
});

app.get("/api/games", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM games ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch games",
    });
  }
});

app.get("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM games WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch game",
    });
  }
});

app.post("/api/games", async (req, res) => {
  try {
    const { title,
       description, 
       release_date, 
       cover_url, 
       status, 
       rating, 
       progress, 
       notes } = req.body;

    const result = await pool.query(
      `INSERT INTO games
        (title, description, release_date, cover_url, status, rating, progress, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        description,
        release_date,
        cover_url,
        status,
        rating,
        progress,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add game",
    });
  }
});

app.put("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      release_date,
      cover_url,
      status,
      rating,
      progress,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE games
       SET title = $1,
           description = $2,
           release_date = $3,
           cover_url = $4,
           status = $5,
           rating = $6,
           progress = $7,
           notes = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        title,
        description,
        release_date,
        cover_url,
        status,
        rating,
        progress,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update game",
    });
  }
});

app.delete("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM games WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.json({
      message: "Game deleted successfully",
      game: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete game",
    });
  }
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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});