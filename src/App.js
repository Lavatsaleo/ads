import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', { username, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setMessage('Login successful!');
        } catch (error) {
            setMessage('Login failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        setMessage('Logged out successfully');
    };

    const handleDashboardAccess = async () => {
        try {
            const response = await axios.get('http://localhost:3000/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Access denied: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="App">
            {!token ? (
                <>
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <div>
                            <label>Username: </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Password: </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">Register</button>
                    </form>

                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Username: </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Password: </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </>
            ) : (
                <>
                    <h2>Dashboard</h2>
                    <button onClick={handleDashboardAccess}>Access Dashboard</button>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
