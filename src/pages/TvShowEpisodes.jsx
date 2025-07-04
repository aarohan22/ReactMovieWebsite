import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/TvShowEpisodes.css";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

const TvShowEpisodes = () => {
  const { id } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [episodesBySeason, setEpisodesBySeason] = useState({});
  const [modalEpisode, setModalEpisode] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
      const data = await res.json();
      setSeasons(data.seasons || []);
    };
    fetchSeasons();
  }, [id]);

  const toggleSeason = async (seasonNumber) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }

    if (!episodesBySeason[seasonNumber]) {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const data = await res.json();
      setEpisodesBySeason((prev) => ({ ...prev, [seasonNumber]: data.episodes || [] }));
    }

    setExpandedSeason(seasonNumber);
  };

  const openModal = (episode) => setModalEpisode(episode);
  const closeModal = () => setModalEpisode(null);

  const handleNext = () => {
    const currentList = episodesBySeason[expandedSeason];
    const idx = currentList.findIndex((e) => e.id === modalEpisode.id);
    if (idx < currentList.length - 1) {
      setModalEpisode(currentList[idx + 1]);
    }
  };

  const handlePrev = () => {
    const currentList = episodesBySeason[expandedSeason];
    const idx = currentList.findIndex((e) => e.id === modalEpisode.id);
    if (idx > 0) {
      setModalEpisode(currentList[idx - 1]);
    }
  };

  return (
    <div className="episodes-container">
      <h1 className="episodes-title">📺 TV Show Episodes</h1>

      {seasons.map((season) => (
        <div
          key={season.id}
          className={`season-panel ${expandedSeason === season.season_number ? "" : "collapsed"}`}
        >
          <div className="season-header" onClick={() => toggleSeason(season.season_number)}>
            <span>{season.name} ({season.episode_count} episodes)</span>
            <span>{expandedSeason === season.season_number ? "▲" : "▼"}</span>
          </div>

          {expandedSeason === season.season_number &&
            episodesBySeason[season.season_number] && (
              <div className="episode-list">
                {episodesBySeason[season.season_number].map((ep) => (
                  <div key={ep.id} className="episode-card" onClick={() => openModal(ep)}>
                    <img
                      src={
                        ep.still_path
                          ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
                          : "https://via.placeholder.com/500x281?text=No+Image"
                      }
                      alt={ep.name}
                      className="episode-poster"
                    />
                    <div className="episode-info">
                      <h4>Ep {ep.episode_number}: {ep.name}</h4>
                      <p>{ep.air_date}</p>
                      <p>⭐ {ep.vote_average?.toFixed(1) || "N/A"} | 🕒 {ep.runtime || "?"} mins</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}

      {modalEpisode && (
        <div className="modal-overlay-blur" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✖</button>

            <h2 className="modal-episode-title">{modalEpisode.name}</h2>

            <div className="modal-episode-details">
              {modalEpisode.still_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w780${modalEpisode.still_path}`}
                  alt={modalEpisode.name}
                  className="modal-image"
                />
              )}

              <div className="modal-episode-meta">
                <p><strong>Air Date:</strong> {modalEpisode.air_date || "Unknown"}</p>
                <p><strong>Episode:</strong> S{modalEpisode.season_number}E{modalEpisode.episode_number}</p>
                <p><strong>Runtime:</strong> {modalEpisode.runtime || "N/A"} mins</p>
                <p><strong>Rating:</strong> ⭐ {modalEpisode.vote_average || "N/A"}</p>
                {modalEpisode.vote_count > 0 && (
                  <p><strong>Votes:</strong> 👥 {modalEpisode.vote_count}</p>
                )}
                {modalEpisode.guest_stars?.length > 0 && (
                  <p><strong>Guest Stars:</strong> {modalEpisode.guest_stars.map(gs => gs.name).join(", ")}</p>
                )}
              </div>
            </div>

            <p className="modal-overview">{modalEpisode.overview || "No overview available."}</p>

            <div className="modal-nav-buttons">
              <button onClick={handlePrev} disabled={
                episodesBySeason[expandedSeason]?.findIndex(e => e.id === modalEpisode.id) === 0
              }>◀ Prev</button>
              <button onClick={handleNext} disabled={
                episodesBySeason[expandedSeason]?.findIndex(e => e.id === modalEpisode.id) ===
                episodesBySeason[expandedSeason]?.length - 1
              }>Next ▶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvShowEpisodes;
