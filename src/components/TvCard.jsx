import { Link } from "react-router-dom";
import "../css/MovieCard.css";
import { useTvContext } from "../contexts/TvContext";
import { useEffect, useState } from "react";
import { loadWatchlist, saveWatchlist } from "../firebase/firestoreHelpers";

function TvCard({ tv }) {
  const { addToFavoriteTv, removeFromFavoriteTv, isTvFavorite } = useTvContext();
  const favorite = isTvFavorite(tv.id);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchWatchlist = async () => {
      try {
        const watchlist = await loadWatchlist("tv");
        if (mounted) setInWatchlist(watchlist.includes(Number(tv.id)));
      } catch (err) {
        console.error("❌ Error fetching TV watchlist:", err);
      }
    };

    fetchWatchlist();

    return () => {
      mounted = false;
    };
  }, [tv.id]);

  const onFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFromFavoriteTv(tv.id) : addToFavoriteTv(tv);
  };

  const onWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const watchlist = await loadWatchlist("tv");
      let updatedList;

      if (watchlist.includes(Number(tv.id))) {
        updatedList = watchlist.filter((id) => id !== Number(tv.id));
        setInWatchlist(false);
      } else {
        updatedList = [...watchlist, Number(tv.id)];
        setInWatchlist(true);
      }

      await saveWatchlist(updatedList, "tv");
    } catch (err) {
      console.error("❌ Error updating TV watchlist:", err);
    }
  };

  return (
    <Link to={`/tv/${tv.id}`} className="movie-link">
      <div className="movie-card">
        <div className="movie-blur-bg" />
        <div className="movie-poster">
          <img
            src={
              tv.poster_path
                ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={tv.name}
          />
          <div className="movie-overlay">
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              ♥
            </button>
            <button
              className={`watchlist-btn ${inWatchlist ? "active" : ""}`}
              onClick={onWatchlistClick}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              👁
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{tv.name}</h3>
          <p><strong>First Air:</strong> {tv.first_air_date || "N/A"}</p>
          <p><strong>Rating:</strong> {tv.vote_average || "N/A"}</p>
        </div>
      </div>
    </Link>
  );
}

export default TvCard;
