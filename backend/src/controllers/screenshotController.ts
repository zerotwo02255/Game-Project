import { Request, Response } from "express";
import pool from "../db/pool.js";

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