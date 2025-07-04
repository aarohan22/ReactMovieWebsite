import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  loadFavoritesFromFirestore,
  saveFavoritesToFirestore,
} from "../firebase/firestoreHelpers";

// ✅ Define context and hook outside the component
const TvContext = createContext();
const useTvContext = () => useContext(TvContext);

const TvProvider = ({ children }) => {
  const [favoriteTvShows, setFavoriteTvShows] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const saved = await loadFavoritesFromFirestore("tv");
        setFavoriteTvShows(saved);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      saveFavoritesToFirestore(favoriteTvShows, "tv");
    }
  }, [favoriteTvShows]);

  const addToFavoriteTv = (tv) => {
    setFavoriteTvShows((prev) =>
      prev.find((item) => item.id === tv.id) ? prev : [...prev, tv]
    );
  };

  const removeFromFavoriteTv = (tvId) =>
    setFavoriteTvShows((prev) => prev.filter((tv) => tv.id !== tvId));

  const isTvFavorite = (tvId) =>
    favoriteTvShows.some((tv) => tv.id === tvId);

  return (
    <TvContext.Provider
      value={{
        favoriteTvShows,
        addToFavoriteTv,
        removeFromFavoriteTv,
        isTvFavorite,
      }}
    >
      {children}
    </TvContext.Provider>
  );
};

// ✅ Export hook and provider in stable form
export { TvProvider, useTvContext };
