
import { useEffect, useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard"; 
import HeroBanner from "../components/HeroBanner"; 
import "../css/Home.css"; 

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function TrendingMoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovies(data.results || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="search-page">
      
      <HeroBanner type="movie" />
      
      <h2>🔥 Trending Movies</h2>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="card-wrapper">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingMoviesPage;
