import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { updateProfile, deleteUser, reload } from "firebase/auth";
import { auth } from "../firebase";
import {
  loadFavoriteGenres,
  saveFavoriteGenres,
  saveUserProfileToFirestore,
  loadUserData,
  loadWatchlist,
} from "../firebase/firestoreHelpers";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";
import "../css/UserPage.css";

const genreOptions = [
  "Action", "Comedy", "Drama", "Fantasy", "Horror",
  "Romance", "Sci-Fi", "Thriller", "Mystery", "Animation"
];

const UserPage = () => {
  const { user, authLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("overview");

  const [displayName, setDisplayName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [tvWatchlist, setTvWatchlist] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  // 🔁 Detect tab from URL query parameter
  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get("tab");
    if (queryTab === "watchlist" || queryTab === "settings" || queryTab === "overview") {
      setTab(queryTab);
    }
  }, [location.search]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return navigate("/login");
    init();
  }, [authLoading, user, navigate]);

  const init = async () => {
    const data = await loadUserData();
    setDisplayName(data.displayName || user.displayName || "");
    setAvatarURL(data.avatarURL || user.photoURL || "");
    const genres = await loadFavoriteGenres();
    setFavoriteGenres(genres);
  };

  useEffect(() => {
    if (tab === "settings") {
      setTimeout(() => {
        document.getElementById("displayNameInput")?.focus();
      }, 100);
    }
    if (tab === "watchlist") {
      fetchWatchlist();
    }
  }, [tab]);

  const fetchWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const movieIds = (await loadWatchlist("movies")).map(Number);
      const tvIds = (await loadWatchlist("tv")).map(Number);

      const fetchItem = async (type, id) => {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=55d4f543b9f3aa97797dda4acce64f2b`;
        try {
          const res = await fetch(url);
          const json = await res.json();
          return json.status_code ? null : json;
        } catch (err) {
          console.error(`❌ Error fetching ${type} ID: ${id}`, err);
          return null;
        }
      };

      const [movies, tvs] = await Promise.all([
        Promise.all(movieIds.map(id => fetchItem("movie", id))),
        Promise.all(tvIds.map(id => fetchItem("tv", id)))
      ]);

      setMovieWatchlist(movies.filter(Boolean));
      setTvWatchlist(tvs.filter(Boolean));
    } catch (err) {
      console.error("❌ Failed to fetch watchlist", err);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleGenreToggle = (genre) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      let newPhotoURL = avatarURL;

      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          newPhotoURL = reader.result;
          await updateProfile(auth.currentUser, { displayName });
          await saveUserProfileToFirestore(displayName, newPhotoURL);
          await saveFavoriteGenres(favoriteGenres);
          await reload(auth.currentUser);
          setAvatarURL(newPhotoURL);
          setMessage("✅ Profile updated!");
          setImageFile(null);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await updateProfile(auth.currentUser, { displayName });
        await saveUserProfileToFirestore(displayName, newPhotoURL);
        await saveFavoriteGenres(favoriteGenres);
        await reload(auth.currentUser);
        setMessage("✅ Info updated!");
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      if (err.message === "Display name already taken") {
        setMessage("⚠️ That display name is already taken.");
      } else {
        setMessage("❌ Error updating profile.");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteUser(auth.currentUser);
      logout();
      navigate("/signup");
    } catch (err) {
      console.error(err);
      setMessage("❌ Couldn't delete account.");
    }
  };

  const renderTabContent = () => {
    if (!user) return null;

    switch (tab) {
      case "overview":
        return (
          <div className="tab-content overview-section">
            <div className="profile-card">
              <div className="avatar-column">
                <img
                  src={avatarURL || `https://ui-avatars.com/api/?name=${displayName || "User"}`}
                  alt="User Avatar"
                  className="user-avatar profile-avatar"
                />
              </div>
              <div className="info-column">
                <h2 className="username">{displayName || "Unnamed User"}</h2>
                <p className="email">{user.email}</p>
                <div className="stats-row">
                  <div className="stat-box">
                    <h4>🎬 Watchlist</h4>
                    <p>Check your saved titles</p>
                  </div>
                  <div className="stat-box">
                    <h4>📅 Joined</h4>
                    <p>
                      {new Date(user.metadata?.creationTime).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }) || "N/A"}
                    </p>
                  </div>
                  <div className="stat-box">
                    <h4>🎧 Genres</h4>
                    <p>{favoriteGenres.length}</p>
                  </div>
                </div>
                <div className="genres-list">
                  <h4>Favorite Genres:</h4>
                  {favoriteGenres.length > 0 ? (
                    <div className="genre-tags">
                      {favoriteGenres.map((genre) => (
                        <span key={genre} className="genre-pill">{genre}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-genres">None selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "watchlist":
        return (
          <div className="tab-content">
            <h2>🎬 Watchlist</h2>
            {loadingWatchlist ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="watchlist-section">
                  <h3>🎥 Movies</h3>
                  {movieWatchlist.length > 0 ? (
                    <div className="card-grid">
                      {movieWatchlist.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  ) : (
                    <p>No movies in watchlist.</p>
                  )}
                </div>
                <div className="watchlist-section">
                  <h3>📺 TV Shows</h3>
                  {tvWatchlist.length > 0 ? (
                    <div className="card-grid">
                      {tvWatchlist.map((tv) => (
                        <TvCard key={tv.id} tv={tv} />
                      ))}
                    </div>
                  ) : (
                    <p>No TV shows in watchlist.</p>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="tab-content">
            <h2>⚙️ Account Settings</h2>
            <div className="settings-section">
              <h3>Profile Info</h3>
              <div className="avatar-edit-container">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : avatarURL || `https://ui-avatars.com/api/?name=${displayName || "User"}`
                  }
                  alt="avatar"
                  className="user-avatar editable-avatar"
                  onClick={() => document.getElementById("avatarInput").click()}
                  title="Click to change avatar"
                />
                <span
                  className="edit-avatar-icon"
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  ✏️
                </span>
                <input
                  type="file"
                  accept="image/*"
                  id="avatarInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
              <input
                id="displayNameInput"
                type="text"
                className="profile-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                maxLength={20}
              />
            </div>
            <div className="settings-section">
              <h3>Favorite Genres</h3>
              <p>Select genres you enjoy most:</p>
              <div className="genre-tags">
                {genreOptions.map((genre) => (
                  <button
                    key={genre}
                    className={`genre-btn ${favoriteGenres.includes(genre) ? "selected" : ""}`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-section">
              <button className="save-btn" onClick={handleSave}>💾 Save Changes</button>
              <button className="delete-btn" onClick={init}>🔄 Reset</button>
            </div>
            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <button className="delete-btn" onClick={handleDelete}>❌ Delete Account</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (authLoading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="user-page">
      <div className="user-card">
        <div className="tabs">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>👤 Overview</button>
          <button className={tab === "watchlist" ? "active" : ""} onClick={() => setTab("watchlist")}>🎬 Watchlist</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>⚙️ Account Settings</button>
        </div>
        {renderTabContent()}
        <div className="user-actions">
          <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}>
            🚪 Logout
          </button>
        </div>
        {message && <p className="status-msg">{message}</p>}
      </div>
    </div>
  );
};

export default UserPage;
