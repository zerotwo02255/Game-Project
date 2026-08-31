import { Request, Response } from "express";
import pool from "../db/pool.js";
import { gameSchema } from "../validators/gameValidator.js";


export const uploadScreenshot = async (
  req: Request,
  res: Response,
) => {
  try {
    const { gameId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Screenshot file is required",
      });
    }

    const imageUrl = `/uploads/screenshots/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO game_screenshots
        (game_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [gameId, imageUrl],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Upload screenshot error:", error);

    res.status(500).json({
      message: "Failed to upload screenshot",
    });
  }
};

export const getGameScreenshots = async (
  req: Request,
  res: Response,
) => {
  try {
    const { gameId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM game_screenshots
       WHERE game_id = $1
       ORDER BY created_at DESC`,
      [gameId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get screenshots error:", error);

    res.status(500).json({
      message: "Failed to fetch screenshots",
    });
  }
};

export const deleteScreenshot = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM game_screenshots
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Screenshot not found",
      });
    }

    res.json({
      message: "Screenshot deleted successfully",
      screenshot: result.rows[0],
    });
  } catch (error) {
    console.error("Delete screenshot error:", error);

    res.status(500).json({
      message: "Failed to delete screenshot",
    });
  }
};

export const getGames = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM games ORDER BY id ASC");

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch games",
    });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);

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
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const validation = gameSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid game data",
        errors: validation.error.flatten(),
      });
    }

    const {
      title,
      description,
      release_date,
      cover_url,
      status,
      rating,
      progress,
      notes,
    } = validation.data;

    // Check if the game already exists
    const existingGame = await pool.query(
      "SELECT * FROM games WHERE LOWER(title) = LOWER($1)",
      [title],
    );

    if (existingGame.rows.length > 0) {
      return res.status(409).json({
        message: "Game already exists",
      });
    }

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
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add game",
    });
  }
};
export const updateGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = gameSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid game data",
        errors: validation.error.flatten(),
      });
    }

    const {
      title,
      description,
      release_date,
      cover_url,
      status,
      rating,
      progress,
      notes,
    } = validation.data;

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
      ],
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
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM games WHERE id = $1 RETURNING *",
      [id],
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
};
