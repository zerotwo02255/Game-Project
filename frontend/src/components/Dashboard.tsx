import type { Game } from "../api/gameApi";
import "./Dashboard.css";
import GameStatCard from "./GameStatCard";


interface DashboardProps {
  games: Game[];
}


function Dashboard({ games }: DashboardProps) {
  const totalGames = games.length;

  const playingGames = games.filter(
    (game) => game.status === "playing"
  ).length;

  const completedGames = games.filter(
    (game) => game.status === "completed"
  ).length;

  const droppedGames = games.filter(
    (game) => game.status === "dropped"
  ).length;

  const bucketListGames = games.filter(
    (game) => game.status === "bucket_list"
  ).length;

  const ratedGames = games.filter(
    (game) => game.rating !== null
  );

  const averageRating =
    ratedGames.length > 0
      ? (
          ratedGames.reduce(
            (total, game) => total + Number(game.rating),
            0
          ) / ratedGames.length
        ).toFixed(1)
      : "—";

  const completionRate =
    totalGames > 0
      ? Math.round((completedGames / totalGames) * 100)
      : 0;

  const currentlyPlaying = games.filter(
    (game) => game.status === "playing"
  );
  const completedGamesList = games.filter(
  (game) => game.status === "completed"
);

const bucketListGamesList = games.filter(
  (game) => game.status === "bucket_list"
);

  return (
    <div className="dashboard">

      {/* =========================
          STAT CARDS
      ========================= */}

    <div className="dashboard-stats">

  <GameStatCard
    games={games}
    icon="🎮"
    label="Total Games"
    count={totalGames}
    subtitle="Your Collection"
  />

  <GameStatCard
    games={currentlyPlaying}
    icon="▶"
    label="Playing"
    count={playingGames}
    subtitle="Currently Playing"
  />

  <GameStatCard
    games={completedGamesList}
    icon="✓"
    label="Completed"
    count={completedGames}
    subtitle="Finished Games"
  />

  <GameStatCard
    games={bucketListGamesList}
    icon="📋"
    label="Bucket List"
    count={bucketListGames}
    subtitle="Want to Play"
  />

</div>

      {/* =========================
          DASHBOARD CONTENT
      ========================= */}

      <div className="dashboard-grid">

        {/* Currently Playing */}

        <section className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Currently Playing</h3>
              <p>{playingGames} games</p>
            </div>
          </div>

          {currentlyPlaying.length === 0 ? (
            <div className="panel-empty">
              <span>🎮</span>
              <p>No games currently playing.</p>
            </div>
          ) : (
            <div className="playing-list">

              {currentlyPlaying.slice(0, 4).map((game) => (
                <div
                  className="playing-item"
                  key={game.id}
                >
                  <div className="playing-cover">

                    {game.cover_url ? (
                      <img
                        src={game.cover_url}
                        alt={`${game.title} cover`}
                      />
                    ) : (
                      <span>🎮</span>
                    )}

                  </div>

                  <div className="playing-info">

                    <strong>{game.title}</strong>

                    <div className="mini-progress">

                      <div className="mini-progress-bar">
                        <div
                          className="mini-progress-fill"
                          style={{
                            width: `${game.progress}%`,
                          }}
                        />
                      </div>

                      <span>
                        {game.progress}%
                      </span>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>


        {/* Statistics */}

        <section className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h3>Gaming Statistics</h3>
              <p>Your overall progress</p>
            </div>
          </div>

          <div className="statistics-list">

            <div className="stat-row">
              <span>Completion Rate</span>
              <strong>{completionRate}%</strong>
            </div>

            <div className="stat-row">
              <span>Average Rating</span>
              <strong>
                {averageRating}
                {averageRating !== "—" && "/10"}
              </strong>
            </div>

            <div className="stat-row">
              <span>Completed</span>
              <strong>{completedGames}</strong>
            </div>

            <div className="stat-row">
              <span>Dropped</span>
              <strong>{droppedGames}</strong>
            </div>

          </div>

          <div className="overall-progress">

            <div className="overall-progress-label">
              <span>Overall Completion</span>
              <strong>{completionRate}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;