import { useEffect, useState } from "react";
import axios from "axios";

interface Screenshot {
  id: number;
  game_id: number;
  image_url: string;
  created_at: string;
}

interface GameScreenshotsProps {
  gameId: number;
}

const API_URL = "http://localhost:5000";

function GameScreenshots({
  gameId,
}: GameScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Selected screenshot for fullscreen view
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null);

  const loadScreenshots = async () => {
    try {
      const response = await axios.get<Screenshot[]>(
        `${API_URL}/api/screenshots/games/${gameId}`,
      );

      setScreenshots(response.data);
    } catch (error) {
      console.error(
        "Load screenshots error:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreenshots();
  }, [gameId]);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("screenshot", file);

      await axios.post(
        `${API_URL}/api/screenshots/games/${gameId}`,
        formData,
      );

      await loadScreenshots();

      event.target.value = "";
    } catch (error) {
      console.error(
        "Upload screenshot error:",
        error,
      );

      alert("Failed to upload screenshot.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this screenshot?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/screenshots/${id}`,
      );

      setScreenshots((current) =>
        current.filter(
          (screenshot) =>
            screenshot.id !== id,
        ),
      );

      // Close fullscreen if deleted
      if (selectedScreenshot?.id === id) {
        setSelectedScreenshot(null);
      }
    } catch (error) {
      console.error(
        "Delete screenshot error:",
        error,
      );

      alert("Failed to delete screenshot.");
    }
  };

  return (
    <section className="game-screenshots">

      {/* Header */}

      <div className="screenshots-header">
        <div>
          <h2>📸 My Screenshots</h2>

          <p>
            Your personal screenshots from this game.
          </p>
        </div>

        <label className="upload-screenshot-button">
          {uploading
            ? "Uploading..."
            : "+ Upload Screenshot"}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
      </div>


      {/* Loading */}

      {loading ? (
        <p className="screenshots-message">
          Loading screenshots...
        </p>
      ) : screenshots.length === 0 ? (

        /* Empty */

        <div className="screenshots-empty">
          <span>📷</span>

          <h3>No screenshots yet</h3>

          <p>
            Upload your first screenshot from this game.
          </p>
        </div>

      ) : (

        /* Screenshot Grid */

        <div className="screenshots-grid">

          {screenshots.map((screenshot) => (
            <div
              className="screenshot-card"
              key={screenshot.id}
            >

              {/* Click image to open */}

              <img
                src={`${API_URL}${screenshot.image_url}`}
                alt="Game screenshot"
                className="screenshot-image"
                onClick={() =>
                  setSelectedScreenshot(
                    screenshot,
                  )
                }
              />

              <button
                type="button"
                className="delete-screenshot-button"
                onClick={() =>
                  handleDelete(
                    screenshot.id,
                  )
                }
              >
                🗑 Delete
              </button>

            </div>
          ))}

        </div>
      )}


      {/* Fullscreen Screenshot */}

      {selectedScreenshot && (
        <div
          className="screenshot-modal"
          onClick={() =>
            setSelectedScreenshot(null)
          }
        >

          {/* Close */}

          <button
            type="button"
            className="screenshot-modal-close"
            onClick={() =>
              setSelectedScreenshot(null)
            }
          >
            ✕
          </button>


          {/* Large Image */}

          <img
            src={`${API_URL}${selectedScreenshot.image_url}`}
            alt="Game screenshot enlarged"
            onClick={(event) =>
              event.stopPropagation()
            }
          />

        </div>
      )}

    </section>
  );
}

export default GameScreenshots;