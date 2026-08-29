import { useEffect, useState } from "react";
import {
  getGames,
  deleteGame,
  type Game,
} from "./api/gameApi";

import AddGameForm from "./components/AddGameForm";
import GameCard from "./components/GameCard";
import Dashboard from "./components/Dashboard";
import "./App.css";

type Filter =
  | "dashboard"
  | "all"
  | "bucket_list"
  | "playing"
  | "completed"
  | "dropped";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<Filter>("dashboard");

  const loadGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteGame(id);
      await loadGames();
    } catch (error) {
      console.error(error);
      alert("Failed to delete game");
    }
  };

  const filteredGames =
    activeFilter === "all"
      ? games
      : games.filter(
          (game) => game.status === activeFilter
        );

  const getCount = (filter: Filter) => {
    if (filter === "dashboard" || filter === "all") {
      return games.length;
    }

    return games.filter(
      (game) => game.status === filter
    ).length;
  };

  if (loading) {
    return <h1>Loading games...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="app-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <span>🎮</span>
          <span>My Journey</span>
        </div>

        <nav className="sidebar-nav">

          {/* Dashboard */}

          <button
            className={
              activeFilter === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("dashboard")
            }
          >
            <span>🏠</span>
            <span>Dashboard</span>
            <span className="nav-count">
              {getCount("dashboard")}
            </span>
          </button>


          {/* My Games */}

          <button
            className={
              activeFilter === "all"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            <span>🎮</span>
            <span>My Games</span>
            <span className="nav-count">
              {getCount("all")}
            </span>
          </button>


          {/* Bucket List */}

          <button
            className={
              activeFilter === "bucket_list"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("bucket_list")
            }
          >
            <span>📋</span>
            <span>Bucket List</span>
            <span className="nav-count">
              {getCount("bucket_list")}
            </span>
          </button>


          {/* Playing */}

          <button
            className={
              activeFilter === "playing"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("playing")
            }
          >
            <span>▶</span>
            <span>Playing</span>
            <span className="nav-count">
              {getCount("playing")}
            </span>
          </button>


          {/* Completed */}

          <button
            className={
              activeFilter === "completed"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("completed")
            }
          >
            <span>✓</span>
            <span>Completed</span>
            <span className="nav-count">
              {getCount("completed")}
            </span>
          </button>


          {/* Dropped */}

          <button
            className={
              activeFilter === "dropped"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveFilter("dropped")
            }
          >
            <span>✕</span>
            <span>Dropped</span>
            <span className="nav-count">
              {getCount("dropped")}
            </span>
          </button>

        </nav>


        {/* Sidebar bottom */}

        <div className="sidebar-bottom">

          <div className="sidebar-stat">
            <span>Total Games</span>
            <strong>{games.length}</strong>
          </div>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        {/* =========================
            HEADER
        ========================= */}

        <header className="top-header">

          <div>

            <h1>My Game Journey</h1>

            <p>
              Keep track of your gaming journey.
            </p>

          </div>

        </header>


        {/* =========================
            DASHBOARD
        ========================= */}

        {activeFilter === "dashboard" && (
          <Dashboard games={games} />
        )}


        {/* =========================
            GAME PAGES
        ========================= */}

        {activeFilter !== "dashboard" && (
          <>
            {/* Add Game */}

            <AddGameForm
              onGameAdded={loadGames}
            />


            {/* Games Section */}

            <section className="games-section">

              <div className="section-header">

                <div>

                  <h2>
                    {activeFilter === "all"
                      ? "My Games"
                      : activeFilter === "bucket_list"
                      ? "Bucket List"
                      : activeFilter === "playing"
                      ? "Playing"
                      : activeFilter === "completed"
                      ? "Completed"
                      : "Dropped"}
                  </h2>

                  <p>
                    {filteredGames.length}{" "}
                    {filteredGames.length === 1
                      ? "game"
                      : "games"}
                  </p>

                </div>

              </div>


              {/* Empty state */}

              {filteredGames.length === 0 ? (

                <div className="empty-state">

                  <div>🎮</div>

                  <h3>No games here</h3>

                  <p>
                    Add a game to start building
                    your collection.
                  </p>

                </div>

              ) : (

                <div className="game-grid">

                  {filteredGames.map((game) => (

                    <GameCard
                      key={game.id}
                      game={game}
                      onDelete={handleDelete}
                      onGameUpdated={loadGames}
                    />

                  ))}

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default App;