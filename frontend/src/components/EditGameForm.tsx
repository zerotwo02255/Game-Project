import { useState } from "react";
import { updateGame, type Game } from "../api/gameApi";

interface EditGameFormProps {
  game: Game;
  onGameUpdated: () => void;
  onCancel: () => void;
}

function EditGameForm({
  game,
  onGameUpdated,
  onCancel,
}: EditGameFormProps) {
  const [title, setTitle] = useState(game.title);
  const [status, setStatus] = useState<Game["status"]>(game.status);
  const [progress, setProgress] = useState(game.progress);
  const [rating, setRating] = useState(
    game.rating === null ? 0 : Number(game.rating),
  );
  const [notes, setNotes] = useState(game.notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateGame(game.id, {
        title: title.trim(),
        description: game.description,
        release_date: game.release_date,
        cover_url: game.cover_url,
        status,
        rating,
        progress,
        notes: notes.trim() || null,
      });

      onGameUpdated();
    } catch (error) {
      console.error("Update game error:", error);
      alert("Failed to update game");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="edit-game-form" onSubmit={handleSubmit}>

      {/* Header */}

      <div className="edit-form-header">
        <div>
          <span className="edit-form-icon">🎮</span>
          <h2>Edit Game</h2>
          <p>Update your game information.</p>
        </div>
      </div>


      {/* Game Title */}

      <div className="form-field">
        <label htmlFor="edit-title">
          Game Title
        </label>

        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
        />
      </div>


      {/* Status */}

      <div className="form-field">
        <label htmlFor="edit-status">
          Status
        </label>

        <select
          id="edit-status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as Game["status"],
            )
          }
        >
          <option value="bucket_list">
            📋 Bucket List
          </option>

          <option value="playing">
            ▶ Playing
          </option>

          <option value="completed">
            ✓ Completed
          </option>

          <option value="dropped">
            ✕ Dropped
          </option>
        </select>
      </div>


      {/* Progress */}

      <div className="slider-field">

        <div className="slider-header">
          <label htmlFor="edit-progress">
            Progress
          </label>

          <strong>{progress}%</strong>
        </div>

        <input
          id="edit-progress"
          className="game-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={progress}
          onChange={(event) =>
            setProgress(Number(event.target.value))
          }
        />

        <div className="slider-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

      </div>


      {/* Rating */}

      <div className="slider-field">

        <div className="slider-header">
          <label htmlFor="edit-rating">
            Rating
          </label>

          <strong>
            ⭐ {Number(rating).toFixed(1)} / 5
          </strong>
        </div>

        <input
          id="edit-rating"
          className="game-slider rating-slider"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={rating}
          onChange={(event) =>
            setRating(Number(event.target.value))
          }
        />

        <div className="slider-labels">
          <span>0</span>
          <span>2.5</span>
          <span>5</span>
        </div>

      </div>


      {/* Notes */}

      <div className="form-field">

        <label htmlFor="edit-notes">
          Notes
        </label>

        <textarea
          id="edit-notes"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder="Add your personal notes about this game..."
          rows={5}
        />

      </div>


      {/* Buttons */}

      <div className="edit-form-actions">

        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-button"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </form>
  );
}

export default EditGameForm;