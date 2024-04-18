import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';
import { useUser } from '../../UserContext';

function AddFriend() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { user } = useUser();

    const handleSearch = async () => {
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            alert('Please enter a search query.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/search-users?query=${encodeURIComponent(trimmedQuery)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            alert('Failed to search for users. Please try again later.');
        }
    };

    const handleAddFriend = async (friendUsername) => {
        try {
            await axios.post(`http://localhost:3001/add-friend`, {
                currentUsername: user.username,
                friendUsername,
            });
            alert(`Friend request sent to ${friendUsername}!`);
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request');
        }
    };

    return (
        <div className="hero-add">
            <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
            <div className="hero-addtextbox">
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button> { }
            </div>
            <div className="hero-displayFriend">
                <ul>
                    {searchResults.map(user => (
                        <li key={user.username} onClick={() => handleAddFriend(user.username)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default AddFriend;