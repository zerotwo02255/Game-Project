import { useState } from "react";
import axios from "axios";
import { createGame } from "../api/gameApi";

interface RawgGame {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  genres: {
    id: number;
    name: string;
  }[];
}

interface GameSearchProps {
  onGameAdded: () => void;
}

function GameSearch({ onGameAdded }: GameSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const searchGames = async () => {
    if (!query.trim()) {
      setMessage("Please enter a game name.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await axios.get<RawgGame[]>(
        "http://localhost:5000/api/rawg/search",
        {
          params: {
            query: query.trim(),
          },
        },
      );

      setResults(response.data);
    } catch (error) {
      console.error("Game search error:", error);

      setMessage("Failed to search games.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGame = async (game: RawgGame) => {
    try {
      setMessage("");
      setMessageType("");

      const response = await axios.get(
        `http://localhost:5000/api/rawg/games/${game.id}`,
      );

      const fullGame = response.data;

      await createGame({
        title: fullGame.name,
        description: fullGame.description_raw || null,
        release_date: fullGame.released || null,
        cover_url: fullGame.background_image || null,
        status: "bucket_list",
        rating: fullGame.rating || null,
        progress: 0,
        notes: null,
      });

      setMessage(`${fullGame.name} added to your games!`);
      setMessageType("success");

      onGameAdded();
    } catch (error: any) {
      console.error(
        "Add RAWG game error:",
        error.response?.data || error,
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to add game.",
      );

      setMessageType("error");
    }
  };

  return (
    <div className="game-search">
      {/* Search Box */}

      <div className="game-search-intro">
        <span className="search-label">
          Search the game database
        </span>

        <p>
          Search for a game and add it directly to your
          collection.
        </p>
      </div>

      <div className="game-search-bar">
        <div className="search-input-wrapper">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search for a game..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                searchGames();
              }
            }}
          />
        </div>

        <button
          type="button"
          onClick={searchGames}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Message */}

      {message && (
        <div className={`game-message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Results */}

      {results.length > 0 && (
        <div className="search-results-section">
          <div className="search-results-header">
            <h3>Search Results</h3>

            <span>
              {results.length} games found
            </span>
          </div>

          <div className="search-results">
            {results.map((game) => (
              <div
                className="search-game-card"
                key={game.id}
              >
                {/* Cover */}

                <div className="search-game-cover">
                  {game.background_image ? (
                    <img
                      src={game.background_image}
                      alt={`${game.name} cover`}
                    />
                  ) : (
                    <div className="search-no-cover">
                      🎮
                    </div>
                  )}
                </div>

                {/* Information */}

                <div className="search-game-info">
                  <h3>{game.name}</h3>

                  <div className="search-game-meta">
                    {game.released && (
                      <span>
                        📅 {game.released}
                      </span>
                    )}

                    <span>
                      ⭐{" "}
                      {game.rating
                        ? game.rating
                        : "Not rated"}
                    </span>
                  </div>

                  {game.genres.length > 0 && (
                    <div className="search-game-genres">
                      {game.genres
                        .slice(0, 3)
                        .map((genre) => (
                          <span key={genre.id}>
                            {genre.name}
                          </span>
                        ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="add-search-game-button"
                    onClick={() =>
                      handleAddGame(game)
                    }
                  >
                    + Add to My Games
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}

      {!loading &&
        results.length === 0 &&
        query.trim() !== "" &&
        !message && (
          <div className="search-empty">
            <span>🎮</span>
            <h3>No games found</h3>
            <p>
              Try searching with a different game name.
            </p>
          </div>
        )}
    </div>
  );
}

export default GameSearch;