import "./css/App.css";
import { Routes, Route } from 'react-router-dom';


import NavBar from './components/NavBar.jsx';
import { MovieProvider } from "./contexts/MovieContext.jsx";
import { TvProvider } from "./contexts/TvContext.jsx"; 


import Home from './pages/Home.jsx';
import Favorites from './pages/Favourites.jsx';
import About from './pages/About.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import ActorDetail from './pages/ActorDetail.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import TvShowEpisodes from "./pages/TvShowEpisodes";

import TrendingMoviesPage from './pages/TrendingMoviesPage.jsx';
import TrendingTvPage from './pages/TrendingTvPage.jsx';
import TvShowDetail from './pages/TvShowDetail.jsx';

function App() {
  return (
    <MovieProvider>
      <TvProvider> 
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/actor/:id" element={<ActorDetail />} />

           
            <Route path="/tv/:id" element={<TvShowDetail />} />
            <Route path="/movies/trending" element={<TrendingMoviesPage />} />
            <Route path="/tv/trending" element={<TrendingTvPage />} />
            <Route path="/tv/:id/episodes" element={<TvShowEpisodes />} />

            <Route path="/search" element={<SearchPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </main>
      </TvProvider>
    </MovieProvider>
  );
}

export default App;
