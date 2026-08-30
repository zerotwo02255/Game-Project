import { useState } from "react";
import type { Game } from "../api/gameApi";
import EditGameForm from "./EditGameForm";

interface GameCardProps {
  game: Game;
  onDelete: (id: number) => void;
  onGameUpdated: () => void;
  onViewDetails: (game: Game) => void;
}

function GameCard({
  game,
  onDelete,
  onGameUpdated,
  onViewDetails,
}: GameCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditGameForm
        game={game}
        onGameUpdated={() => {
          setIsEditing(false);
          onGameUpdated();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="game-card">
      <div className="game-cover-container">
        {game.cover_url ? (
          <img
            className="game-cover"
            src={game.cover_url}
            alt={`${game.title} cover`}
          />
        ) : (
          <div className="game-cover no-cover">
            <span>🎮</span>
            <p>No Cover</p>
          </div>
        )}

        <div className={`status-badge status-${game.status}`}>
          {game.status.replace("_", " ")}
        </div>
      </div>

      <div className="game-info">
        <h3 className="game-title">{game.title}</h3>

        <div className="game-rating">
          <span>★</span>
          {game.rating !== null ? (
            <strong>{game.rating}</strong>
          ) : (
            <span className="not-rated">Not rated</span>
          )}
        </div>

        <div className="progress-section">
          <div className="progress-label">
            <span>Progress</span>
            <strong>{game.progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${game.progress}%` }}
            />
          </div>
        </div>

        {game.description && (
          <p className="game-description">{game.description}</p>
        )}

        <div className="game-actions">
          <button
            className="details-button"
            onClick={() => onViewDetails(game)}
          >
            Details
          </button>

          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button className="delete-button" onClick={() => onDelete(game.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
