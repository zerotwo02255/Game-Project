import { Request, Response } from "express";
import pool from "../db/pool.js";
import { gameSchema } from "../validators/gameValidator.js";
import { searchRawgGames, getRawgGameById} from "../services/rawgService.js";

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
      genres,
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
        (title, description, release_date, cover_url, status, rating, progress, notes,genres)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
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
        genres,
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
      genres,
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
           genres=$9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
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
        genres,
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

export const updateMissingGenres = async (
  _req: Request,
  res: Response,
) => {
  try {
    const result = await pool.query(
      `SELECT id, title
       FROM games
       WHERE genres = '{}'
       ORDER BY id ASC`,
    );

    let updated = 0;
    let failed = 0;

    for (const game of result.rows) {
      try {
        console.log(`Finding genres for: ${game.title}`);

        const searchResults = await searchRawgGames(game.title);

        if (!searchResults || searchResults.length === 0) {
          console.log(`No RAWG result: ${game.title}`);
          failed++;
          continue;
        }

        const exactMatch =
          searchResults.find(
            (rawgGame: any) =>
              rawgGame.name.toLowerCase() ===
              game.title.toLowerCase(),
          ) || searchResults[0];

        const fullGame = await getRawgGameById(exactMatch.id);

        const genres =
          fullGame.genres?.map(
            (genre: { name: string }) => genre.name,
          ) || [];

        await pool.query(
          `UPDATE games
           SET genres = $1
           WHERE id = $2`,
          [genres, game.id],
        );

        console.log(
          `Updated: ${game.title} → ${genres.join(", ")}`,
        );

        updated++;
      } catch (error) {
        console.error(
          `Failed to update genres for ${game.title}:`,
          error,
        );

        failed++;
      }
    }

    res.json({
      message: "Missing genres update completed",
      total: result.rows.length,
      updated,
      failed,
    });
  } catch (error) {
    console.error("Update missing genres error:", error);

    res.status(500).json({
      message: "Failed to update missing genres",
    });
  }
};