import React from "react";
import "../App.css";
import "./HeroSection.css";
import { ButtonCamera } from "./buttons/ButtonCamera";
import { ButtonUpload } from "./buttons/ButtonUpload";

function HeroSection() {
  return (
    <div className="hero-container">
      <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
      <h1>START LISTENING</h1>
      <p>A Social Audio Experience</p>
      <div className="hero-btns">
        <ButtonCamera
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          LIVE RECORD
        </ButtonCamera>
        
        <ButtonUpload
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          FILE UPLOAD
        </ButtonUpload>
      </div>
    </div>
  );
}

export default HeroSection;
