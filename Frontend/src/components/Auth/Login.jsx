import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const [mode, setMode] = useState('choice'); // 'choice', 'member', 'admin'
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(credentials.username, credentials.password);
            if (!result.success) {
                setError(result.message);
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'choice') {
        return (
            <div className="login-choice-container">
                <div className="choice-card member-choice" onClick={() => setMode('member')}>
                    <div className="choice-icon">🏠</div>
                    <h2 className="m3-display-small">Resident Portal</h2>
                    <p className="m3-body-large">Access your voting room, PR announcements, and community dashboard.</p>
                    <button className="m3-filled-btn pill-btn">Get Started</button>
                </div>
                <div className="choice-divider">
                    <span className="divider-line"></span>
                    <span className="m3-label-large">OR</span>
                    <span className="divider-line"></span>
                </div>
                <div className="choice-card admin-choice" onClick={() => setMode('admin')}>
                    <div className="choice-icon">🛡️</div>
                    <h2 className="m3-display-small">HOA Officer Access</h2>
                    <p className="m3-body-large">Secure login for association administrators and board members.</p>
                    <button className="m3-outlined-btn standard-btn">Admin Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`login-page ${mode}-view`}>
            {mode === 'member' && <div className="member-bg-overlay"></div>}
            
            <button className="back-btn m3-icon-btn" onClick={() => setMode('choice')}>←</button>

            <div className={`login-card ${mode}-card`}>
                <header className="login-header">
                    <h1 className="m3-headline-medium">
                        {mode === 'member' ? 'Welcome Back!' : 'Admin Verification'}
                    </h1>
                    <p className="m3-body-medium m3-on-surface-variant">
                        {mode === 'member' 
                            ? 'Enter your credentials to enter the resident portal.' 
                            : 'Log in to access association management stools.'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="m3-input-group">
                        <label className={mode === 'member' ? 'floating-label' : 'm3-form-label'}>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={credentials.username} 
                            onChange={handleChange} 
                            required 
                            className={mode === 'member' ? 'pill-input' : 'm3-large-input'} 
                            placeholder="username"
                        />
                    </div>

                    <div className="m3-input-group">
                        <label className={mode === 'member' ? 'floating-label' : 'm3-form-label'}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                            className={mode === 'member' ? 'pill-input' : 'm3-large-input'} 
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="m3-error-container">
                            <span className="m3-body-small">{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={mode === 'member' ? 'm3-filled-btn pill-btn' : 'm3-filled-btn standard-btn'}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Log In'}
                    </button>
                </form>

                {mode === 'member' && (
                    <footer className="login-footer">
                        <span className="m3-body-small">Not a registered member? </span>
                        <button className="m3-text-btn m3-body-small">Contact Officer</button>
                    </footer>
                )}
            </div>
        </div>
    );
}
