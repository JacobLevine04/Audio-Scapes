import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';
import { ButtonUpload } from "../buttons/ButtonUpload";
import { AddFriendButton } from "../buttons/AddFriendButton";
import { SocialButton } from "../buttons/SocialButton";
import FileList from "../FileList";
//import { useFiles } from '../../FileContext';

function User() {
    const { user } = useUser();
    // const { userFiles } = useFiles();
    const [friendsFiles, setFriendsFiles] = useState([]);
    const [currentFriends, setCurrentFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!user) return;

            try {
                const res = await axios.get(`http://localhost:3001/friends`, { params: { username: user.username } });
                setCurrentFriends(res.data.currentFriends);
            } catch (error) {
                console.error('Failed to fetch friends', error);
            }
        };

        fetchFriends();
    }, [user]);

    useEffect(() => {
        const loadFriendFiles = () => {
            const allFriendsFiles = [];
    
            for (const friendUsername of currentFriends) {
                // Retrieve the array of file objects from local storage.
                const friendFiles = JSON.parse(localStorage.getItem(`uploadedFiles-${friendUsername}`) || '[]');
                if (Array.isArray(friendFiles)) {
                    // Ensure the structure includes the filename, username, and uploadedAt.
                    allFriendsFiles.push(...friendFiles.map(file => ({
                      fileName: file.fileName, 
                      username: file.username,
                      uploadedAt: file.uploadedAt
                    })));
                } else {
                    console.error("No files found or invalid format for", friendUsername);
                }
            }
    
            setFriendsFiles(allFriendsFiles);
        };
    
        if (currentFriends.length > 0) {
            loadFriendFiles();
        }
    }, [currentFriends]);
    
    

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
            <FileList files={friendsFiles} />
        </div>
    );
}

export default User;
