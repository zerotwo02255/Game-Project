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
    game.rating === null ? "" : String(game.rating)
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateGame(game.id, {
        title,
        description: game.description,
        release_date: game.release_date,
        cover_url: game.cover_url,
        status,
        rating: rating === "" ? null : Number(rating),
        progress: Number(progress),
        notes: game.notes,
      });

      onGameUpdated();
    } catch (error) {
      console.error(error);
      alert("Failed to update game");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Game</h2>

      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <select
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as Game["status"])
        }
      >
        <option value="bucket_list">Bucket List</option>
        <option value="playing">Playing</option>
        <option value="completed">Completed</option>
        <option value="dropped">Dropped</option>
      </select>

      <input
        type="number"
        min="0"
        max="100"
        value={progress}
        onChange={(event) =>
          setProgress(Number(event.target.value))
        }
      />

      <input
        type="number"
        min="0"
        max="10"
        step="0.1"
        placeholder="Rating"
        value={rating}
        onChange={(event) => setRating(event.target.value)}
      />

      <button type="submit">
        Save Changes
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditGameForm;