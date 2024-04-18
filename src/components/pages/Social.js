import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';

function Social() {
    const [currentFriends, setCurrentFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const { user } = useUser();

    const fetchFriends = useCallback(async () => {
        if (!user) return;

        try {
            const res = await axios.get(`http://localhost:3001/friends`, { params: { username: user.username } });
            setCurrentFriends(res.data.currentFriends);
            setPendingFriends(res.data.pendingFriends);
        } catch (error) {
            console.error('Failed to fetch friends', error);
        }
    }, [user]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    const acceptFriend = async (friendUsername) => {
        try {
            await axios.post(`http://localhost:3001/accept-friend`, {
                currentUsername: user.username,
                friendUsername,
            });
            fetchFriends(); // Re-fetch friends to update the list after accepting a friend request
        } catch (error) {
            console.error('Failed to accept friend request', error);
        }
    };

    return (
        <div>
            <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
            <div className='hero-create'>
                <h2>Current Friends:</h2>
                {currentFriends.map((friend) => (
                    <div key={friend}>{friend}</div>
                ))}
            </div>
            <div className='hero-create'>
                <h2>Pending Friends:</h2>
                {pendingFriends.map((friend) => (
                    <div key={friend}>
                        {friend} <button onClick={() => acceptFriend(friend)}>Accept</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Social;
