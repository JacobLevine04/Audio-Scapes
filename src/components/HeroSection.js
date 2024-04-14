import React from "react";
import "../App.css";
import "./HeroSection.css";
import { ButtonLogin } from "./buttons/ButtonLogin";
import { ButtonCreate } from "./buttons/ButtonCreate";

function HeroSection() {
  return (
    <div className="hero-container">
      <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
      <h1>START LISTENING</h1>
      <p>A Social Audio Experience</p>
      <div className="hero-btns">
        <ButtonLogin
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          LOGIN
        </ButtonLogin>

        <ButtonCreate
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          CREATE ACCOUNT
        </ButtonCreate>

      </div>
    </div>
  );
}

export default HeroSection;
