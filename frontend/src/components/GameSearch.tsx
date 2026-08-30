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
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");


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

      
                    {message && (
                  <div className={`game-message ${messageType}`}>
                  {message}
              </div>
             )}

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
                     "Failed to add game"
                    );
                   setMessageType("error");
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
