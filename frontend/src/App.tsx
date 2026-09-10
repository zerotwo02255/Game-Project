import { useEffect, useState } from "react";
import { getGames, deleteGame, type Game } from "./api/gameApi";

import GameCard from "./components/GameCard";
import Dashboard from "./components/Dashboard";
import "./App.css";
import GameDetails from "./components/GameDetails";
import SearchPage from "./components/SearchPage";
import UpcomingGameCard from "./components/UpcomingGameCard";
import Sidebar from "./components/Sidebar";

type Filter =
  | "dashboard"
  | "search"
  | "all"
  | "bucket_list"
  | "playing"
  | "completed"
  | "dropped"
  | "upcoming";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<Filter>("dashboard");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [activeGenre, setActiveGenre] = useState("All Genres");

  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "rating" | "progress"
  >("newest");

  const loadGames = async () => {
    try {
      const data = await getGames();

      setGames(data);

      setSelectedGame((currentSelectedGame) => {
        if (!currentSelectedGame) {
          return null;
        }

        return (
          data.find((game) => game.id === currentSelectedGame.id) ?? null
        );
      });
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

  const filteredGames = games
    .filter((game) => {
      const matchesUpcoming =
        activeFilter === "upcoming"
          ? game.release_date !== null &&
            new Date(game.release_date) > new Date()
          : true;

      const matchesStatus =
        activeFilter === "all" ||
        activeFilter === "dashboard" ||
        activeFilter === "search" ||
        activeFilter === "upcoming" ||
        game.status === activeFilter;

      const matchesGenre =
        activeGenre === "All Genres" ||
        game.genres.some(
          (genre) =>
            genre.toLowerCase() === activeGenre.toLowerCase(),
        );

      return matchesUpcoming && matchesStatus && matchesGenre;
    })
    .sort((a, b) => {
      if (activeFilter === "upcoming") {
        return (
          new Date(a.release_date!).getTime() -
          new Date(b.release_date!).getTime()
        );
      }

      if (sortBy === "rating") {
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      }

      if (sortBy === "progress") {
        return b.progress - a.progress;
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });

  const getCount = (filter: Filter) => {
    if (filter === "dashboard" || filter === "all") {
      return games.length;
    }

    if (filter === "upcoming") {
      return games.filter(
        (game) =>
          game.release_date !== null &&
          new Date(game.release_date) > new Date(),
      ).length;
    }

    return games.filter((game) => game.status === filter).length;
  };

  if (loading) {
    return <h1>Loading games...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        getCount={getCount}
        totalGames={games.length}
      />

      <main className="main-content">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="top-header">
          <div>
            <h1>My Game Journey</h1>
            <p>Keep track of your gaming journey.</p>
          </div>
        </header>

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activeFilter === "dashboard" && <Dashboard games={games} />}

        {/* =====================================================
            SEARCH
        ===================================================== */}

        {activeFilter === "search" && (
          <SearchPage onGameAdded={loadGames} />
        )}

        {/* =====================================================
            GAME PAGES
        ===================================================== */}

        {activeFilter !== "dashboard" && activeFilter !== "search" && (
          <>
            {selectedGame ? (
              <GameDetails
                game={selectedGame}
                onBack={() => setSelectedGame(null)}
                onGameUpdated={loadGames}
              />
            ) : (
              <section className="games-section">
                {/* =================================================
                    MY GAMES HEADER
                ================================================= */}

                <div className="my-games-header">
                  <div className="my-games-heading">
                    <h2>
                      {activeFilter === "all"
                        ? "My Games"
                        : activeFilter === "bucket_list"
                          ? "Bucket List"
                          : activeFilter === "playing"
                            ? "Playing"
                            : activeFilter === "completed"
                              ? "Completed"
                              : activeFilter === "dropped"
                                ? "Dropped"
                                : "Upcoming Games"}
                    </h2>

                    <p>
                      {activeFilter === "upcoming"
                        ? "Games coming to your gaming journey soon."
                        : `${filteredGames.length} ${
                            filteredGames.length === 1
                              ? "game"
                              : "games"
                          }`}
                    </p>
                  </div>

                  {/* SORT */}

                  <select
                    className="game-sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as
                          | "newest"
                          | "oldest"
                          | "rating"
                          | "progress",
                      )
                    }
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="rating">Highest Rating</option>
                    <option value="progress">
                      Highest Progress
                    </option>
                  </select>
                </div>

                {/* =================================================
                    GENRE FILTER BAR
                ================================================= */}

                {activeFilter !== "upcoming" && (
                  <div className="genre-filters">
                    <button
                      className={`genre-filter ${
                        activeGenre === "All Genres" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("All Genres")}
                    >
                      <span>▦</span>
                      All Genres
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Horror" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Horror")}
                    >
                      <span>👻</span>
                      Horror
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Action" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Action")}
                    >
                      <span>⚔️</span>
                      Action
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Soulslike" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Soulslike")}
                    >
                      <span>💀</span>
                      Soulslike
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "RPG" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("RPG")}
                    >
                      <span>🧙</span>
                      RPG
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Shooter" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Shooter")}
                    >
                      <span>🎯</span>
                      Shooter
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Adventure" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Adventure")}
                    >
                      <span>🗺️</span>
                      Adventure
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Stealth" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Stealth")}
                    >
                      <span>🥷</span>
                      Stealth
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Survival" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Survival")}
                    >
                      <span>🌲</span>
                      Survival
                    </button>

                    <button
                      className={`genre-filter ${
                        activeGenre === "Racing" ? "active" : ""
                      }`}
                      onClick={() => setActiveGenre("Racing")}
                    >
                      <span>🏁</span>
                      Racing
                    </button>

                    <button
                      className="genre-filter genre-more"
                      type="button"
                    >
                      More
                      <span>⌄</span>
                    </button>
                  </div>
                )}

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {filteredGames.length === 0 ? (
                  <div className="empty-state">
                    <div>🎮</div>

                    <h3>No games here</h3>

                    <p>
                      Add a game to start building your collection.
                    </p>
                  </div>
                ) : (
                  /* =================================================
                     GAME GRID
                  ================================================= */

                  <div className="game-grid">
                    {filteredGames.map((game) =>
                      activeFilter === "upcoming" ? (
                        <UpcomingGameCard
                          key={game.id}
                          game={game}
                          onViewDetails={setSelectedGame}
                        />
                      ) : (
                        <GameCard
                          key={game.id}
                          game={game}
                          onDelete={handleDelete}
                          onGameUpdated={loadGames}
                          onViewDetails={setSelectedGame}
                        />
                      ),
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;