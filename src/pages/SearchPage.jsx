
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/SearchPage.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [actorCredits, setActorCredits] = useState([]);
  const [selectedTab, setSelectedTab] = useState("movie");
  const [loadingCredits, setLoadingCredits] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";

  const navigate = useNavigate();
  const { isFavorite } = useMovieContext();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [movieRes, tvRes, personRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`),
          fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`),
          fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`)
        ]);

        const movieData = await movieRes.json();
        const tvData = await tvRes.json();
        const personData = await personRes.json();

        setMovies(movieData.results || []);
        setTvShows(tvData.results || []);
        setActors(personData.results || []);

        if (personData.results?.length > 0) {
          const firstPerson = personData.results[0];
          fetchCreditsForActor(firstPerson.id);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    };

    if (query) fetchResults();
  }, [query]);

  const fetchCreditsForActor = async (actorId) => {
    try {
      setLoadingCredits(true);
      const res = await fetch(`https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${API_KEY}`);
      const data = await res.json();
      const sorted = data.cast?.sort((a, b) => b.popularity - a.popularity) || [];
      setActorCredits(sorted);
    } catch (err) {
      console.error("Actor credits fetch error:", err);
    } finally {
      setLoadingCredits(false);
    }
  };

  const actorMovies = actorCredits.filter(c => c.media_type === "movie");
  const actorTVShows = actorCredits.filter(c => c.media_type === "tv");

  return (
    <div className="search-page">
      <h2>
        Search Results for: <span className="highlight">"{query}"</span>
      </h2>

      
      <div className="tab-selector">
        <button onClick={() => setSelectedTab("movie")} className={selectedTab === "movie" ? "active" : ""}>🎬 Movies</button>
        <button onClick={() => setSelectedTab("tv")} className={selectedTab === "tv" ? "active" : ""}>📺 TV Shows</button>
        <button onClick={() => setSelectedTab("actor")} className={selectedTab === "actor" ? "active" : ""}>🧑 Actors</button>
      </div>

     
      {selectedTab === "movie" && (
        <div className="search-section">
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div className="card-wrapper" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))
            ) : (
              <p className="error-message">No movies found.</p>
            )}
          </div>
        </div>
      )}

      
      {selectedTab === "tv" && (
        <div className="search-section">
          <div className="movies-grid">
            {tvShows.length > 0 ? (
              tvShows.map((tv) => (
                <div className="card-wrapper" key={tv.id}>
                  <TvCard tv={tv} />
                </div>
              ))
            ) : (
              <p className="error-message">No TV shows found.</p>
            )}
          </div>
        </div>
      )}

      
      {selectedTab === "actor" && (
        <div className="search-section">
          {actors.length > 0 ? (
            <div className="actor-highlight">
              <div
                className="actor-card-simple"
                onClick={() => navigate(`/actor/${actors[0].id}`)}
              >
                <img
                  src={
                    actors[0].profile_path
                      ? `https://image.tmdb.org/t/p/w185${actors[0].profile_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt={actors[0].name}
                />
                <div>
                  <h3>{actors[0].name}</h3>
                  <p>Known For: {actors[0].known_for_department}</p>
                </div>
              </div>

              {loadingCredits ? (
                <p className="loading">Loading credits...</p>
              ) : (
                <>
                  {actorMovies.length > 0 && (
                    <>
                      <h3 className="credit-header">🎬 Movies</h3>
                      <div className="movies-grid">
                        {actorMovies.map((item) => (
                          <div
                            className="card-wrapper"
                            key={`movie-${item.id}`}
                            onClick={() => navigate(`/movie/${item.id}`)}
                          >
                            <MovieCard movie={item} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {actorTVShows.length > 0 && (
                    <>
                      <h3 className="credit-header">📺 TV Shows</h3>
                      <div className="movies-grid">
                        {actorTVShows.map((item) => (
                          <div
                            className="card-wrapper"
                            key={`tv-${item.id}`}
                            onClick={() => navigate(`/tv/${item.id}`)}
                          >
                            <TvCard tv={item} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="error-message">No actor results found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
