import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetailsAndExtras = async () => {
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=55d4f543b9f3aa97797dda4acce64f2b`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube" && vid.official
        );
        if (trailer) setTrailerKey(trailer.key);

        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=55d4f543b9f3aa97797dda4acce64f2b`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast.slice(0, 15));
        setDirectors(creditsData.crew.filter((person) => person.job === "Director"));

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie data. Check your internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetailsAndExtras();
  }, [id]);

  if (loading) return <div className="movie-detail-loading">Loading movie details...</div>;
  if (error) return <div className="movie-detail-error">{error}</div>;
  if (!movie) return null;

  return (
    <>
      {/* 🔥 BACKDROP BANNER WITH BLUR */}
      <div
        className={`movie-detail-container ${showModal ? "blur-background" : ""}`}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="movie-detail-overlay">
          <div className="movie-detail-wrapper">
            <div className="movie-detail-card">
              <img
                className="movie-detail-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-detail-info glass">
                <h1>{movie.title}</h1>
                {movie.tagline && (
                  <p style={{ fontStyle: "italic", color: "#ff4089" }}>{movie.tagline}</p>
                )}
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Overview:</strong> {movie.overview}</p>
                <p><strong>Rating:</strong> 🌟 {movie.vote_average}</p>
                <p><strong>Language:</strong> {movie.original_language?.toUpperCase()}</p>
                {movie.genres?.length > 0 && (
                  <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
                )}
                <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
                <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
                <p><strong>Status:</strong> {movie.status}</p>
                {movie.homepage && (
                  <p>   
                  <strong>Homepage:</strong>{" "}
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                      {new URL(movie.homepage).hostname.replace("www.", "")}
                    </a>
                  </p>  
                )}
                   <p> <strong>IMDB ID:</strong> {movie.imdb_id}</p>
               {directors.length > 0 && (
                  <p>
                    <strong>Director{directors.length > 10 ? "s" : ""}:</strong>{" "}
                    {directors.map(d => d.name).join(", ")}
                  </p>
                )}
                {movie.production_companies?.length > 0 && (
                  <p>
                    <strong>Production:</strong>{" "}
                    {movie.production_companies.map(p => p.name).join(", ")}
                  </p>
                )}

                {trailerKey && (
                  <button className="trailer-button" onClick={() => setShowModal(true)}>
                    ▶ Watch Trailer
                  </button>
                )}

                <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                  Go to{" "}
                  <strong>
                    <a href="/about" target="_blank" rel="noopener noreferrer">
                      About
                    </a>
                  </strong>{" "}
                  page for more.
                </p>
              </div>
            </div>

            {cast.length > 0 && (
              <div className="cast-section">
                <h2>Top Cast</h2>
                <div className="cast-list">
                  {cast.map((actor) => (
                    <Link
                      to={`/actor/${actor.id}`}
                      className="cast-card"
                      key={actor.cast_id}
                    >
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
      </div>

      {showModal && (
        <div className="modal-overlay-blur" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
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

export default MovieDetail;
