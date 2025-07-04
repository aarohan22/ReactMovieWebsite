import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadWatchlist, saveWatchlist } from "../firebase/firestoreHelpers";

function MovieCard({ movie }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const favourite = isFavorite(movie.id);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchWatchlist = async () => {
      try {
        const watchlist = await loadWatchlist("movies");
        if (mounted) setInWatchlist(watchlist.includes(Number(movie.id)));
      } catch (error) {
        console.error("❌ Error fetching movie watchlist:", error);
      }
    };

    fetchWatchlist();

    return () => {
      mounted = false;
    };
  }, [movie.id]);

  const onFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favourite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  const onWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const watchlist = await loadWatchlist("movies");
      let updatedList;

      if (watchlist.includes(Number(movie.id))) {
        updatedList = watchlist.filter((id) => id !== Number(movie.id));
        setInWatchlist(false);
      } else {
        updatedList = [...watchlist, Number(movie.id)];
        setInWatchlist(true);
      }

      await saveWatchlist(updatedList, "movies");
    } catch (error) {
      console.error("❌ Error updating watchlist:", error);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-link">
      <div className="movie-card">
        <div className="movie-blur-bg" />
        <div className="movie-poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
          />
          <div className="movie-overlay">
            <button
              className={`favorite-btn ${favourite ? "active" : ""}`}
              onClick={onFavoriteClick}
              aria-label={favourite ? "Remove from favorites" : "Add to favorites"}
            >
              ♥
            </button>
            <button
              className={`watchlist-btn ${inWatchlist ? "active" : ""}`}
              onClick={onWatchlistClick}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              👁
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p><strong>Release:</strong> {movie.release_date || "N/A"}</p>
          <p><strong>Rating:</strong> {movie.vote_average || "N/A"}</p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
