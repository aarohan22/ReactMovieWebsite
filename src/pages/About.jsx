import React from 'react';
import "../css/About.css";

function About() {
  return (
    <>
      <div className="about-page">
        <h1>About this page</h1>
        <p>This is a React application showcasing routing, favorites, and movie browsing.</p>
        <p>It includes a Home, Favorites, Movie Details, and About page — all styled with modern CSS.</p>
        <p>The site is responsive, dynamic, and built for movie lovers 💖</p>
      </div>

      <div className="about-page">
        <h2>Watch Movies Online</h2>
        <p>
          Want to watch movies online for free? Visit our movie site:&nbsp;
          <a
            href="https://yts-official.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to watch movies
          
          </a>
          <p>Also click on the avatar for another working website</p>
        </p>
      </div>

      <div className="about-avatar">
        <h2>Made by Aarohan</h2>
        <a
          href="https://watch2movies.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://wallpapercave.com/wp/wp7046960.jpg"
            alt="Aarohan's Avatar"
          />
        </a>
      </div>
    </>
  );
}

export default About;
