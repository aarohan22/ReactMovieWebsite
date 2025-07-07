import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";
import {
  loadFavoritesFromFirestore,
  saveFavoritesToFirestore,
} from "../firebase/firestoreHelpers";

const MovieContext = createContext();
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const saved = await loadFavoritesFromFirestore("movies");
        setFavorites(saved);
      }
    });
    return unsubscribe;
  }, []);

  
  useEffect(() => {
    if (auth.currentUser) {
      saveFavoritesToFirestore(favorites, "movies");
    }
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => m.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{ favoriteMovies: favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
};
