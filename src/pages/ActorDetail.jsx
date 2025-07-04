import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/ActorDetail.css";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function ActorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [allCredits, setAllCredits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const [personRes, movieCreditsRes, tvCreditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${API_KEY}`),
        ]);

        const personData = await personRes.json();
        const movieCredits = await movieCreditsRes.json();
        const tvCredits = await tvCreditsRes.json();

        const allAppearances = [
          ...movieCredits.cast.map((item) => ({ ...item, media_type: "movie" })),
          ...tvCredits.cast.map((item) => ({ ...item, media_type: "tv" })),
        ];

        const sorted = allAppearances
          .filter((item) => item.popularity)
          .sort((a, b) => b.popularity - a.popularity);

        setActor(personData);
        setAllCredits(sorted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not load actor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading actor info...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!actor) return null;

  return (
    <div className="actor-detail-container">
      <div className="actor-card">
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={actor.name}
        />
        <div className="actor-info">
          <h1>{actor.name}</h1>
          <p><strong>Born:</strong> {actor.birthday || "Unknown"}</p>
          <p><strong>Place:</strong> {actor.place_of_birth || "Unknown"}</p>
          <p><strong>Known For:</strong> {actor.known_for_department || "N/A"}</p>
          <p><strong>Popularity:</strong> {actor.popularity?.toFixed(1)}</p>
          {actor.biography && actor.biography.length > 40 && (
            <p><strong>Biography:</strong> {actor.biography}</p>
          )}
        </div>
      </div>

      {allCredits.length > 0 && (
        <div className="known-for-section">
          <h2>All Appearances</h2>
          <div className="known-for-list">
            {allCredits.map((item) => {
              const title = item.title || item.name;
              const releaseYear = (item.release_date || item.first_air_date || "").slice(0, 4);
              const image = item.poster_path
                ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                : "https://via.placeholder.com/185x278?text=No+Image";
              return (
                <div
                  className="known-for-card"
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                >
                  <img src={image} alt={title} />
                  <p className="known-for-title">{title}</p>
                  <div className={`media-badge ${item.media_type}`}>
                    {item.media_type === "movie" ? "Movie" : "TV Show"}
                  </div>
                  <p className="release-year">{releaseYear || "N/A"}</p>
                  {item.character && (
                    <p className="character-name">as {item.character}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActorDetail;
