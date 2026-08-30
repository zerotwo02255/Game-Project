import express from "express";
import multer from "multer";
import path from "path";

import {
  uploadScreenshot,
  getGameScreenshots,
  deleteScreenshot,
} from "../controllers/screenshotController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/screenshots");
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get(
  "/games/:gameId",
  getGameScreenshots,
);

router.post(
  "/games/:gameId",
  upload.single("screenshot"),
  uploadScreenshot,
);

router.delete(
  "/:id",
  deleteScreenshot,
);

export default router;