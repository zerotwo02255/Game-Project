import { useState } from "react";
import { createGame } from "../api/gameApi";

interface AddGameFormProps {
  onGameAdded: () => void;
}

function AddGameForm({ onGameAdded }: AddGameFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<
    "bucket_list" | "playing" | "completed" | "dropped"
  >("bucket_list");

  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createGame({
        title,
        description: null,
        release_date: null,
        cover_url: null,
        status,
        rating: rating === "" ? null : Number(rating),
        progress: Number(progress),
        notes: null,
      });

      setTitle("");
      setStatus("bucket_list");
      setProgress(0);
      setRating("");

      onGameAdded();
    } catch (error: any) {
      console.error(
        "Add game error:",
        JSON.stringify(error.response?.data, null, 2)
      );

      alert(
        error.response?.data?.message || "Failed to add game"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Game</h2>

      <input
        type="text"
        placeholder="Game title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <select
        value={status}
        onChange={(event) =>
          setStatus(
            event.target.value as
              | "bucket_list"
              | "playing"
              | "completed"
              | "dropped"
          )
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

      <button type="submit">Add Game</button>
    </form>
  );
}

export default AddGameForm;