const API_KEY = "55d4f543b9f3aa97797dda4acce64f2b";
const BASE_URL = "https://api.themoviedb.org/3";

//  Trending Movies
export const getTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

//  Trending TV Shows
export const getTrendingTvShows = async () => {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

//  Popular Movies
export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

// Popular TV Shows
export const getPopularTvShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

//  Movie Search
export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

//  TV Show Search
export const searchTvShows = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

//  Movie Details
export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Movie fetch failed");
  return await response.json();
};

//  Movie Cast
export const getMovieCredits = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch cast");
  return await response.json();
};

//  TV Show Details
export const getTvShowDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("TV show fetch failed");
  return await response.json();
};

//  TV Show Cast
export const getTvShowCredits = async (id) => {
  const response = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch TV cast");
  return await response.json();
};

//  Movie Genres
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
};

//  TV Genres
export const getTvGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
};
