import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password }, { withCredentials: true });
            setMessage('Login successful!');
            window.location.href = '/dashboard'; // Redirect to dashboard on successful login
        } catch (error) {
            setMessage('Login failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-page">
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
            {message && <p>{message}</p>}
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('viewer'); // Default role is 'viewer'
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', { username, password, role });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="register-page">
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
                <div>
                    <label>Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="viewer">Viewer</option>
                        <option value="uploader">Uploader</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

function Dashboard() {
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');

    const handleDashboardAccess = async () => {
        try {
            const response = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
            setMessage(response.data.message);
            setRole(response.data.role);
        } catch (error) {
            setMessage('Access denied: ' + (error.response?.data?.message || error.message));
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post('http://localhost:3000/token', {}, { withCredentials: true });
            setMessage('Token refreshed successfully!');
        } catch (error) {
            setMessage('Could not refresh token: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            setMessage('Logged out successfully');
            window.location.href = '/login'; // Redirect to login after logout
        } catch (error) {
            setMessage('Logout failed: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        handleDashboardAccess();
    }, []);

    return (
        <div className="dashboard-page">
            <h2>Dashboard</h2>
            <p>{message}</p>
            {role === 'uploader' && (
                <div>
                    <button onClick={() => alert('CSV upload feature coming soon!')}>Upload CSV</button>
                </div>
            )}
            <button onClick={refreshToken}>Refresh Token</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

function AdminPanel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('viewer'); // Default role for new users
    const [message, setMessage] = useState('');

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/admin/add-user', { username, password, role }, { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to add user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleCSVUpload = async () => {
        // Implement CSV upload functionality
        alert('CSV upload functionality to be implemented');
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <form onSubmit={handleAddUser}>
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
                <div>
                    <label>Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="viewer">Viewer</option>
                        <option value="uploader">Uploader</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Add User</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={handleCSVUpload}>Upload CSV</button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
