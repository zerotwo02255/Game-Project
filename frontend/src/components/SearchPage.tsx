import GameSearch from "./GameSearch";
import AddGameForm from "./AddGameForm";

interface SearchPageProps {
  onGameAdded: () => void;
}

function SearchPage({ onGameAdded }: SearchPageProps) {
  return (
    <section className="search-page">

      <div className="search-page-hero">
        <div className="search-page-icon">🔍</div>

        <h2>Search Games</h2>

        <p>
          Find a game and add it to your gaming journey.
        </p>
      </div>

      <div className="search-page-content">

        <div className="search-section">
          <GameSearch onGameAdded={onGameAdded} />
        </div>

        <div className="search-divider">
          <span>OR</span>
        </div>

        <div className="manual-add-section">
          <div className="manual-add-header">
            <span>➕</span>

            <div>
              <h3>Add a Game Manually</h3>
              <p>
                Already know the game? Add it directly to your collection.
              </p>
            </div>
          </div>

          <AddGameForm onGameAdded={onGameAdded} />
        </div>

      </div>

    </section>
  );
}

export default SearchPage;