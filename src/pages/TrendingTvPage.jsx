
import { useEffect, useState } from "react";
import TvCard from "../components/TvCard";
import HeroBanner from "../components/HeroBanner";
import "../css/Home.css"; 

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function TrendingTvPage() {
  const [tvShows, setTvShows] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setTvShows(data.results || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="search-page">
      
      <HeroBanner type="tv" />
      
      <h2>📺 Trending TV Shows</h2>
      <div className="movies-grid">
        {tvShows.map(show => (
          <div key={show.id} className="card-wrapper">
            <TvCard tv={show} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingTvPage;
