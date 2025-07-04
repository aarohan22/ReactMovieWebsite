// src/pages/Favorites.jsx
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useTvContext } from "../contexts/TvContext";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Favorites() {
  const [user] = useAuthState(auth);

  // ✅ Corrected: use 'favoriteMovies' from context
  const { favoriteMovies } = useMovieContext();

  // ✅ Defensive fallback in case context fails
  const { favoriteTvShows = [] } = useTvContext();

  const [activeTab, setActiveTab] = useState("movies");

  if (!user) {
    return (
      <div className="favorites-page">
        <h2>Login Required</h2>
        <p className="auth-message">Please login to view your favorites.</p>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === "movies") {
      return favoriteMovies?.length > 0 ? (
        <div className="favorites-list">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <h2>No Favorite Movies</h2>
          <p>Click the ♥ icon on a movie to add it to your favorites.</p>
        </div>
      );
    } else {
      return favoriteTvShows?.length > 0 ? (
        <div className="favorites-list">
          {favoriteTvShows.map((tv) => (
            <TvCard key={tv.id} tv={tv} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <h2>No Favorite TV Shows</h2>
          <p>Click the ♥ icon on a show to add it to your favorites.</p>
        </div>
      );
    }
  };

  return (
    <div className="favorites-page">
      <h2>❤️ My Favorites</h2>

      <div className="tab-buttons">
        <button
          className={activeTab === "movies" ? "active" : ""}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
        <button
          className={activeTab === "tv" ? "active" : ""}
          onClick={() => setActiveTab("tv")}
        >
          TV Shows
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

export default Favorites;
