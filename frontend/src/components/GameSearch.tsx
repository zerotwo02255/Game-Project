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

  const searchGames = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get<RawgGame[]>(
        "http://localhost:5000/api/rawg/search",
        {
          params: {
            query: query,
          },
        },
      );

      setResults(response.data);
    } catch (error) {
      console.error("Game search error:", error);
      alert("Failed to search games");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="game-search-section">
      <h2>Find a Game</h2>

      <div className="game-search-bar">
        <input
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              searchGames();
            }
          }}
        />

        <button type="button" onClick={searchGames} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="search-results">
        {results.map((game) => (
          <div className="search-game-card" key={game.id}>
            {game.background_image ? (
              <img src={game.background_image} alt={game.name} />
            ) : (
              <div className="search-no-cover">🎮</div>
            )}

            <div className="search-game-info">
              <h3>{game.name}</h3>

              {game.released && <p>📅 {game.released}</p>}

              <p>⭐ {game.rating || "Not rated"}</p>

              <p>{game.genres.map((genre) => genre.name).join(", ")}</p>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await createGame({
                      title: game.name,
                      description: null,
                      release_date: game.released,
                      cover_url: game.background_image,
                      status: "bucket_list",
                      rating: game.rating || null,
                      progress: 0,
                      notes: null,
                    });

                    alert(`${game.name} added to your games!`);

                    onGameAdded();
                  } catch (error: any) {
                    console.error(
                      "Add RAWG game error:",
                      error.response?.data || error,
                    );

                    alert(
                      error.response?.data?.message || "Failed to add game",
                    );
                  }
                }}
              >
                + Add Game
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GameSearch;
