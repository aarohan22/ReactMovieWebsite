import { useState, useEffect } from "react";
import "../css/Home.css";
import "../css/MovieCard.css";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";
import HeroBanner from "../components/HeroBanner";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function Home() {
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestTVShows, setLatestTVShows] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`)
        ]);

        const movieData = await movieRes.json();
        const tvData = await tvRes.json();

        const movies = (movieData.results || []).map((item) => ({
          ...item,
          media_type: "movie",
        }));

        const tvShows = (tvData.results || []).map((item) => ({
          ...item,
          media_type: "tv",
        }));

        setLatestMovies(movies);
        setLatestTVShows(tvShows);

        // Mix and shuffle both movies and TV shows
        const mixed = [...movies, ...tvShows];
        const shuffled = mixed.sort(() => 0.5 - Math.random()).slice(0, 5);
        setFeaturedItems(shuffled);
      } catch (err) {
        console.error(err);
        setError("Failed to load latest content.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) return <div className="home loading">Loading latest content...</div>;
  if (error) return <div className="home error-message">{error}</div>;

  return (
    <>
      <HeroBanner featuredItems={featuredItems} />

      <div className="home">
        <section className="latest-section">
          <h2 className="section-title">🎬 Latest Movies</h2>
          <div className="movies-grid">
            {latestMovies.map((movie) => (
              <MovieCard movie={movie} key={`movie-${movie.id}`} />
            ))}
          </div>
        </section>

        <section className="latest-section">
          <h2 className="section-title">📺 Latest TV Shows</h2>
          <div className="movies-grid">
            {latestTVShows.map((tv) => (
              <TvCard tv={tv} key={`tv-${tv.id}`} />
            ))}
          </div>
        </section>
      </div>

      <h2 className="welcome-message">
        <span role="img" aria-label="fire">🔥</span> Welcome to <strong>TheMovieHub</strong>! <span role="img" aria-label="movie camera">🎥</span>
      </h2>
    </>
  );
}

export default Home;
