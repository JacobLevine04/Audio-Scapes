import React from "react";
import "../../App.css";
import { ButtonUpload } from "../buttons/ButtonUpload";
import { AddFriendButton } from "../buttons/AddFriendButton";
import { SocialButton } from "../buttons/SocialButton";
import FileList from "../FileList"; // Import your FileList component

function User() {
    return (
        <div className="user-page">
            <div className="hero-container">
                <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
                <h1>START LISTENING</h1>
                <p>A Social Audio Experience</p>
                <div className="hero-btns">

                    <ButtonUpload
                        className="btns"
                        buttonStyle="btn--outline"
                        buttonSize="btn--large"
                    >
                        UPLOAD
                    </ButtonUpload>

                    <AddFriendButton
                        className="btns"
                        buttonStyle="btn--outline"
                        buttonSize="btn--large"
                    >
                        ADD FRIENDS
                    </AddFriendButton>

                    <SocialButton
                        className="btns"
                        buttonStyle="btn--outline"
                        buttonSize="btn--large"
                    >
                        SOCIAL
                    </SocialButton>

                </div>
            </div>
            {/* Add the FileList component below the buttons */}
            <FileList />
        </div>
    );
}

export default User;
