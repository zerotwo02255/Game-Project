import { useEffect, useState } from "react";
import { getGames, type Game } from "./api/gameApi";
import AddGameForm from "./components/AddGameForm";


function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
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

  if (loading) {
    return <h1>Loading games...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>My Game Journey</h1>

      <AddGameForm onGameAdded={loadGames} />

      {games.length === 0 ? (
        <p>No games yet.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.title}</strong> — {game.status} —{" "}
              {game.progress}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;