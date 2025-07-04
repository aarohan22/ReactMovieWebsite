import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/MovieDetail.css";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function TvShowDetail() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        const detailRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`);
        const detailData = await detailRes.json();
        setTvShow(detailData);

        const videoRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (vid) =>
            vid.type === "Trailer" &&
            vid.site === "YouTube" &&
            vid.official === true
        );
        if (trailer) setTrailerKey(trailer.key);

        const creditsRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`);
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 20));
        setDirectors(creditsData.crew.filter((person) => person.job === "Director"));

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load TV show data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTvShowDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading TV show...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!tvShow) return null;

  return (
    <>
      <div className={`movie-detail-container ${showModal ? "blur-background" : ""}`}>
        <div className="movie-detail-wrapper">
          <div className="movie-detail-card">
            <img
              className="movie-detail-poster"
              src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
            />
            <div className="movie-detail-info">
              <h1>{tvShow.name}</h1>
              {tvShow.tagline && (
                <p style={{ fontStyle: "italic", color: "#ff4089" }}>{tvShow.tagline}</p>
              )}
              <p><strong>First Air Date:</strong> {tvShow.first_air_date}</p>
              <p><strong>Overview:</strong> {tvShow.overview}</p>
              <p><strong>Rating:</strong> 🌟 {tvShow.vote_average}</p>
              <p><strong>Language:</strong> {tvShow.original_language?.toUpperCase()}</p>
              {tvShow.genres?.length > 0 && (
                <p><strong>Genres:</strong> {tvShow.genres.map(g => g.name).join(", ")}</p>
              )}
              <p><strong>Status:</strong> {tvShow.status}</p>
              <p><strong>Seasons:</strong> {tvShow.number_of_seasons}</p>
              <p><strong>Episodes:</strong> {tvShow.number_of_episodes}</p>

              {directors.length > 0 && (
                <p><strong>Director{directors.length > 1 ? "s" : ""}:</strong> {directors.map(d => d.name).join(", ")}</p>
              )}

              {tvShow.production_companies?.length > 0 && (
                <p><strong>Production:</strong> {tvShow.production_companies.map(p => p.name).join(", ")}</p>
              )}

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {trailerKey && (
                  <button className="trailer-button" onClick={() => setShowModal(true)}>
                    ▶ Watch Trailer
                  </button>
                )}
                <button
                  className="trailer-button"
                  onClick={() => navigate(`/tv/${id}/episodes`)}
                  style={{ backgroundColor: "#5f27cd" }}
                >
                  📺 Episode Info
                </button>
              </div>

              <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                Visit our <strong>
                  <a href="/about" target="_blank" rel="noopener noreferrer">
                    About
                  </a></strong> page for full shows.
              </p>
            </div>
          </div>

          {cast.length > 0 && (
            <div className="cast-section">
              <h2>Top Cast</h2>
              <div className="cast-list">
                {cast.map((actor) => (
                  <Link to={`/actor/${actor.id}`} className="cast-card" key={actor.credit_id}>
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Image"
                      }
                      alt={actor.name}
                    />
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">as {actor.character}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay-blur" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="TV Show Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default TvShowDetail;
