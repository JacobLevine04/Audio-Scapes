import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { LibraryMusic } from "@mui/icons-material";

function Footer() {
  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Scroll to browse audio files including podcasts, music, samples, and snippets
        </p>
        <p className="footer-subscription-text">Start listening today</p>
        <div className="input-areas">
        </div>
      </section>
      <section class="social-media">
        <div class="social-media-wrap">
          <div class="footer-logo">
            <Link to="/" className="social-logo">
              AudioScapes&nbsp;
              <LibraryMusic color="white" fontSize="large" />
            </Link>
          </div>
          <small class="website-rights">AudioScapes © 2024</small>
          <div class="social-icons">
            <Link
              class="social-icon-link spotify"
              to="/"
              target="_blank"
              aria-label="Spotify"
            >
              <i class="fa-brands fa-spotify"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
