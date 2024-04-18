import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

function Create() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, confirmPassword }),
            });

            if (response.ok) {
                alert("Account created successfully");
                navigate('/');
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error("Failed to create account", error);
            alert("Failed to create account");
        }
    };

    return (
        <div className="hero-create">
            <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
            <form className="user-creation-form" onSubmit={handleSubmit}>
                <div className="hero-textbox">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="hero-textbox">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="hero-textbox">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="hero-textbox">
                    <button type="submit">Create Account</button>
                </div>
            </form>
            <div>
            
            </div>
        </div>
    );
}

export default Create;

