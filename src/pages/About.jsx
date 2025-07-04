import React from "react";
import { FaExternalLinkAlt, FaHeart } from "react-icons/fa";
import "../css/About.css";

function About() {
  return (
    <div className="about-container">
      <section className="about-section">
        <h1>About This Page</h1>
        <p>
          This is a React application showcasing routing, favorites, and movie
          browsing.
        </p>
        <p>
          It includes a Home, Favorites, Movie Details, and About page — all
          styled with modern CSS.
        </p>
        <p>
          The site is responsive, dynamic, and built for movie lovers{" "}
          <FaHeart color="hotpink" />
        </p>
      </section>

      <section className="about-section">
        <h2>Watch Movies Online</h2>
        <p>
          Want to watch movies online for free? Visit our movie site:&nbsp;
          <a
            href="https://yts-official.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to watch movies <FaExternalLinkAlt size="0.8em" />
          </a>
        </p>
        <p>Also click on the avatar below for another working movie website.</p>
      </section>

      <section className="about-avatar">
        <h2>Made by Aarohan</h2>
        <a
          href="https://watch2movies.net/"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit another movie site"
        >
          <img
            className="avatar-img"
            src="https://wallpapercave.com/wp/wp7046960.jpg"
            alt="Aarohan's Avatar"
          />
        </a>
      </section>
    </div>
  );
}

export default About;
