import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/ActorDetail.css";

function ActorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [knownFor, setKnownFor] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const [personRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}`),
        ]);

        const personData = await personRes.json();
        const creditsData = await creditsRes.json();

        setActor(personData);
        setKnownFor(
          creditsData.cast
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
        );
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

      {knownFor.length > 0 && (
        <div className="known-for-section">
          <h2>Top Movies</h2>
          <div className="known-for-list">
            {knownFor.map((movie) => (
              <div
                className="known-for-card"
                key={movie.id}
                title={movie.title}
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActorDetail;
