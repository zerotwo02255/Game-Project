import type { Game } from "../api/gameApi";

interface UpcomingGameCardProps {
  game: Game;
  onViewDetails: (game: Game) => void;
}

function UpcomingGameCard({
  game,
  onViewDetails,
}: UpcomingGameCardProps) {
  const releaseDate = game.release_date
    ? new Date(game.release_date)
    : null;

  const getDaysUntilRelease = () => {
    if (!releaseDate) {
      return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const release = new Date(releaseDate);
    release.setHours(0, 0, 0, 0);

    const difference =
      release.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24),
    );
  };

  const daysUntilRelease = getDaysUntilRelease();

  return (
    <article className="upcoming-game-card">

      {/* Cover */}

      <div className="upcoming-game-cover">
        {game.cover_url ? (
          <img
            src={game.cover_url}
            alt={`${game.title} cover`}
          />
        ) : (
          <div className="upcoming-no-cover">
            🎮
          </div>
        )}

        <div className="upcoming-release-badge">
          📅 Upcoming
        </div>
      </div>

      {/* Information */}

      <div className="upcoming-game-info">

        <h3>{game.title}</h3>

        {releaseDate && (
          <div className="upcoming-release-date">
            <span>Release Date</span>

            <strong>
              {releaseDate.toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </strong>
          </div>
        )}

        {daysUntilRelease !== null && (
          <div className="upcoming-countdown">
            {daysUntilRelease === 0
              ? "Releases today 🎉"
              : daysUntilRelease === 1
                ? "Releases tomorrow"
                : `${daysUntilRelease} days to go`}
          </div>
        )}

        {game.rating !== null && (
          <div className="upcoming-rating">
            ⭐ {game.rating}
          </div>
        )}

        <button
          type="button"
          className="upcoming-details-button"
          onClick={() => onViewDetails(game)}
        >
          View Details →
        </button>

      </div>
    </article>
  );
}

export default UpcomingGameCard;