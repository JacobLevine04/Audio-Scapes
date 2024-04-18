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
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              AudioScapes&nbsp;
              <LibraryMusic color="white" fontSize="large" />
            </Link>
          </div>
          <small className="website-rights">AudioScapes © 2024</small>
          {/* Removed Spotify icon link */}
        </div>
      </section>
    </div>
  );
}

export default Footer;
