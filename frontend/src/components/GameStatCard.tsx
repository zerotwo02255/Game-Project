import { useEffect, useState } from "react";
import type { Game } from "../api/gameApi";
import "./GameStatCard.css";

interface GameStatCardProps {
  games: Game[];
  icon: string;
  label: string;
  count: number;
  subtitle: string;
}

function GameStatCard({
  games,
  icon,
  label,
  count,
  subtitle,
}: GameStatCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (games.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((previousIndex) => {
          return (previousIndex + 1) % games.length;
        });

        setIsAnimating(false);
      }, 450);
    }, 5000);

    return () => clearInterval(interval);
  }, [games.length]);

  useEffect(() => {
    if (currentIndex >= games.length) {
      setCurrentIndex(0);
    }
  }, [games.length, currentIndex]);

  const currentGame = games[currentIndex];

  const nextIndex =
    games.length > 0
      ? (currentIndex + 1) % games.length
      : 0;

  const nextGame = games[nextIndex];

  return (
    <div className="game-stat-card">

      {/* HEADER */}
      <div className="game-stat-header">
        <div className="game-stat-title">
          <span className="game-stat-icon">
            {icon}
          </span>

          <span>{label}</span>
        </div>


       
      </div>


      {/* CAROUSEL */}
      {currentGame ? (
        <div className="game-stat-content">

          <div
            className={
              isAnimating
                ? "game-stat-slide current"
                : "game-stat-slide current static"
            }
          >
            <div className="game-stat-cover">
              {currentGame.cover_url ? (
                <img
                  src={currentGame.cover_url}
                  alt={`${currentGame.title} cover`}
                />
              ) : (
                <span>🎮</span>
              )}
            </div>

            <div className="game-stat-info">
              <strong>{currentGame.title}</strong>
              <span>{subtitle}</span>
            </div>
          </div>


          {isAnimating && nextGame && (
            <div className="game-stat-slide next">

              <div className="game-stat-cover">
                {nextGame.cover_url ? (
                  <img
                    src={nextGame.cover_url}
                    alt={`${nextGame.title} cover`}
                  />
                ) : (
                  <span>🎮</span>
                )}
              </div>

              <div className="game-stat-info">
                <strong>{nextGame.title}</strong>
                <span>{subtitle}</span>
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="game-stat-empty">
          <span>🎮</span>
          <p>No games yet</p>
        </div>
      )}


      {/* DOTS */}
      {games.length > 1 && (
        <div className="game-stat-dots">
          {games.slice(0, 6).map((game, index) => (
            <span
              key={game.id}
              className={
                index === currentIndex
                  ? "game-stat-dot active"
                  : "game-stat-dot"
              }
            />
          ))}

          {games.length > 6 && (
            <span className="game-stat-more">
              +{games.length - 6}
            </span>
          )}
        </div>
      )}

    </div>
  );
}

export default GameStatCard;