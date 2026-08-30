import { useState } from "react";
import type { Game } from "../api/gameApi";
import EditGameForm from "./EditGameForm";
import GameScreenshots from "./GameScreenshots";

interface GameDetailsProps {
  game: Game;
  onBack: () => void;
   onGameUpdated: () => void;
}

function GameDetails({
  game,
  onBack,
  onGameUpdated,
  }: GameDetailsProps) {


  const [isEditing, setIsEditing] = useState(false);

  // Show Edit Form
if (isEditing) {
  return (
    <section className="game-details">
      <button
        className="back-button"
        onClick={() => setIsEditing(false)}
      >
        ← Back to Details
      </button>

      <div className="edit-form-wrapper">
        <EditGameForm
          game={game}
          onGameUpdated={() => {
            setIsEditing(false);
            onGameUpdated();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    </section>
  );
}

  return (
    <section className="game-details">

      {/* Back Button */}

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Games
      </button>


      {/* Details Card */}

      <div className="game-details-card">

        {/* Cover */}

        <div className="game-details-cover">
          {game.cover_url ? (
            <img
              src={game.cover_url}
              alt={`${game.title} cover`}
            />
          ) : (
            <div className="game-cover no-cover">
              <span>🎮</span>
              <p>No Cover</p>
            </div>
          )}
        </div>


        {/* Information */}

        <div className="game-details-info">

          <div className="details-title-row">
            <h1>{game.title}</h1>

            <button
              className="details-edit-button"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Game
            </button>
          </div>


          {/* Meta Information */}

          <div className="game-details-meta">

            <span
              className={`status-badge status-${game.status}`}
            >
              {game.status.replace("_", " ")}
            </span>

            {game.release_date && (
              <span>
                📅{" "}
                {new Date(
                  game.release_date
                ).toLocaleDateString()}
              </span>
            )}

            <span>
              ⭐{" "}
              {game.rating !== null
                ? game.rating
                : "Not rated"}
            </span>

          </div>


          {/* Progress */}

          <div className="details-progress">

            <div className="progress-label">
              <span>Progress</span>

              <strong>
                {game.progress}%
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${game.progress}%`,
                }}
              />
            </div>

          </div>


          {/* Description */}

          {game.description && (
            <div className="details-description">

              <h3>Description</h3>

              <p>
                {game.description}
              </p>

            </div>
          )}


          {/* Notes */}

          {game.notes && (
            <div className="details-notes">

              <h3>Notes</h3>

              <p>
                {game.notes}
              </p>

            </div>
          )}

        </div>

      </div>
            <GameScreenshots gameId={game.id} /> 
    </section>
  );
}

export default GameDetails;