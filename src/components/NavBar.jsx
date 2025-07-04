import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import "../css/NavBar.css";
import { UserContext } from "../contexts/UserContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";

function NavBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { user, logout } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const profileDropdownRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Set profile image from user context
  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    } else if (user?.displayName) {
      setProfileImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`);
    } else {
      setProfileImage("https://ui-avatars.com/api/?name=User");
    }
  }, [user]);

  // Debounced search API
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
          fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
          fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        ])
          .then(async ([movieRes, tvRes, personRes]) => {
            const movieData = await movieRes.json();
            const tvData = await tvRes.json();
            const personData = await personRes.json();

            const combined = [
              ...movieData.results.map(item => ({ ...item, type: "movie" })),
              ...tvData.results.map(item => ({ ...item, type: "tv" })),
              ...personData.results.map(item => ({ ...item, type: "person" }))
            ];

            combined.sort((a, b) => b.popularity - a.popularity);
            setResults(combined.slice(0, 7));
          })
          .catch(err => console.error(err));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close search & profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResults([]);
        setShowSearch(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setResults([]);
      setQuery("");
    }
  };

  const handleNavigateItem = (id, type) => {
    if (type === "movie") navigate(`/movie/${id}`);
    else if (type === "tv") navigate(`/tv/${id}`);
    else if (type === "person") navigate(`/actor/${id}`);

    setQuery("");
    setResults([]);
    setShowSearch(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar glass">
     
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">💥 TheMovieHub 🎥</Link>
      </div>

      
      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/movies/trending" className="nav-link">Trending Movies</Link>
        <Link to="/tv/trending" className="nav-link">Trending TV Shows</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>

      
      <div className="navbar-right" ref={dropdownRef} style={{ position: 'relative' }}>
        {!showSearch ? (
          <button
            className="search-icon-btn"
            onClick={() => setShowSearch(true)}
            aria-label="Open search"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        ) : (
          <form
            onSubmit={handleSearchSubmit}
            className={`search-container-overlay ${showSearch ? "search-active" : ""}`}
            role="search"
          >
            <input
              type="text"
              className="search-input-expanded"
              placeholder="Search movies, TV shows or actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              aria-label="Search movies, TV shows or actors"
            />
            <button
              type="button"
              className="search-close"
              onClick={() => {
                setShowSearch(false);
                setQuery("");
                setResults([]);
              }}
              aria-label="Close search"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            {results.length > 0 && (
              <ul className="search-dropdown" role="listbox">
                {results.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="search-item"
                    onClick={() => handleNavigateItem(item.id, item.type)}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNavigateItem(item.id, item.type);
                    }}
                  >
                    <img
                      src={
                        item.type === "person"
                          ? (item.profile_path
                              ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                              : "https://via.placeholder.com/92x138?text=No+Image")
                          : (item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "https://via.placeholder.com/92x138?text=No+Image")
                      }
                      alt={item.name || item.title}
                      className="search-item-img"
                    />
                    <div className="search-item-info">
                      <span className="search-item-title">
                        {item.title || item.name}
                      </span>
                      <span className="search-item-date">
                        {item.release_date || item.first_air_date || ""}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </form>
        )}

        
        {user ? (
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <img
              src={profileImage}
              alt="Profile"
              className="profile-icon"
              title={user.displayName || "Profile"}
              onClick={() => setDropdownOpen((open) => !open)}
              style={{ cursor: "pointer" }}
            />
            {dropdownOpen && (
              <ul className="profile-dropdown-menu">
                <li>
                  <Link to="/user?tab=overview" onClick={() => setDropdownOpen(false)}>
                    User Profile
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" onClick={() => setDropdownOpen(false)}>
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/user?tab=watchlist" onClick={() => setDropdownOpen(false)}>
                    Watchlist
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="logout-btn-dropdown"
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link login-button">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
