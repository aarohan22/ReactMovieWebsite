import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HeroBanner.css";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function HeroBanner({ type = "movie", featuredItems = null }) {
  const [featured, setFeatured] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch movies or TV shows or use passed featuredItems
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        if (featuredItems && featuredItems.length > 0) {
          setFeatured(featuredItems.slice(0, 5));
        } else {
          const url = `https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();
          const results = (data.results || []).map(item => ({
            ...item,
            media_type: type, // inject type
          }));
          setFeatured(results.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching featured content:", err);
      }
    };
    fetchFeatured();
  }, [type, featuredItems]);

  // Start auto slide
  useEffect(() => {
    if (featured.length === 0) return;
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, [featured]);

  const startAutoPlay = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 3000);
  };

  const handleDotClick = (i) => {
    clearInterval(intervalRef.current);
    setIndex(i);
    startAutoPlay();
  };

  const current = featured[index];
  if (!current) return null;

  const title = current.title || current.name || "Untitled";
  const mediaType = current.media_type || type;

  return (
    <div
      className="hero-banner fade-slide"
      style={{
        backgroundImage: current.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${current.backdrop_path})`
          : "url(/fallback.jpg)",
      }}
      role="banner"
    >
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-overview">
          {current.overview
            ? current.overview.length > 180
              ? current.overview.slice(0, 180) + "..."
              : current.overview
            : "No description available."}
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn"
            onClick={() => navigate(`/${mediaType}/${current.id}`)}
          >
            More Info
          </button>
        </div>

        <div className="hero-dots" role="tablist">
          {featured.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => handleDotClick(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
