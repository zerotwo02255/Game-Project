import express from "express";

import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  updateMissingGenres,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/", getGames);

router.get("/update-missing-genres", updateMissingGenres);

router.get("/:id", getGameById);

router.post("/", createGame);

router.put("/:id", updateGame);

router.delete("/:id", deleteGame);



export default router;