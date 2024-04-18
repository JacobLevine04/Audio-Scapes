import React, { useState } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const { setUser } = useUser();
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled) return;

        try {
            const response = await fetch('http://localhost:3001/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setUser({ username });
                alert('Logged in successfully');
                navigate('/user');
            } else {
                const newLoginAttempts = loginAttempts + 1;
                setLoginAttempts(newLoginAttempts);

                if (newLoginAttempts >= 3) {
                    setIsDisabled(true);
                    setTimeout(() => {
                        setIsDisabled(false);
                        setLoginAttempts(0);
                    }, 15000);
                    alert("Too many failed login attempts. Please wait 15 seconds before trying again.");
                } else {
                    alert('Failed to log in. Please check your username and password.');
                }
            }
        } catch (error) {
            console.error('Login error', error);
            alert('Failed to log in');
        }
    };

    return (
        <div className='hero-create'>
            <video src='/videos/background.mp4' autoPlay loop muted className='dimmed-video' />
            <form className='user-creation-form' onSubmit={handleSubmit}>
                <div className='hero-textbox'>
                    <label>Username</label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isDisabled} />
                </div>
                <div className='hero-textbox'>
                    <label>Password</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isDisabled} />
                </div>
                <div className='hero-textbox'>
                    <button type='submit' disabled={isDisabled}>Login</button>
                </div>
            </form>
      
        </div>
    );
}

export default Login;