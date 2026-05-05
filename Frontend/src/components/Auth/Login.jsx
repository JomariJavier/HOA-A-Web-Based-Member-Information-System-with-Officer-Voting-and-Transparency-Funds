import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';
import RegisterModal from './RegisterModal';

export default function Login() {
    const { login } = useAuth();
    const [mode, setMode] = useState('choice'); // 'choice', 'member', 'admin'
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ username: '', password: '', general: '' });
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const usernameRef = React.useRef(null);

    React.useEffect(() => {
        if (mode !== 'choice' && usernameRef.current) {
            usernameRef.current.focus();
        }
    }, [mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        // Clear field-specific error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '', general: '' }));
        }
    };

    const validate = () => {
        const newErrors = { username: '', password: '', general: '' };
        let isValid = true;

        // OWASP: Trim inputs and check for empty values
        const cleanUsername = credentials.username.trim();

        // 1. Data Type & Format: Use a whitelist regex (alphanumeric + common symbols)
        // This prevents many injection attempts at the UI layer.
        const usernameRegex = /^[a-zA-Z0-9._@-]+$/;

        if (!cleanUsername) {
            newErrors.username = 'Please enter your username.';
            isValid = false;
        } else if (cleanUsername.length < 3) {
            newErrors.username = 'Username is too short (min 3 characters).';
            isValid = false;
        } else if (cleanUsername.length > 50) {
            newErrors.username = 'Username is too long (max 50 characters).';
            isValid = false;
        } else if (!usernameRegex.test(cleanUsername)) {
            newErrors.username = 'Username contains invalid characters.';
            isValid = false;
        }

        if (!credentials.password) {
            newErrors.password = 'Please enter your password.';
            isValid = false;
        } else if (credentials.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters.';
            isValid = false;
        } else if (credentials.password.length > 100) {
            newErrors.password = 'Password exceeds maximum length.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', password: '', general: '' });

        if (!validate()) return;

        // OWASP: Sanitize before sending (trimming)
        const sanitizedUsername = credentials.username.trim();

        setLoading(true);
        try {
            const result = await login(sanitizedUsername, credentials.password);
            if (!result.success) {
                // OWASP: Use a generic error message for authentication failures
                // to prevent user enumeration (though we trust the backend's result.message for now,
                // we can override it here if it's too specific).
                setErrors(prev => ({ ...prev, general: result.message || 'Invalid username or password. Please try again.' }));
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, general: 'Security/Connection error. Access denied.' }));
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
                            ref={usernameRef}
                            type="text" 
                            name="username" 
                            value={credentials.username} 
                            onChange={handleChange} 
                            className={`${mode === 'member' ? 'pill-input' : 'm3-large-input'} ${errors.username ? 'm3-input-error' : ''}`} 
                            placeholder="username"
                        />
                        {errors.username && <span className="m3-error-text m3-body-small" style={{marginTop: '4px', display: 'block'}}>{errors.username}</span>}
                    </div>

                    <div className="m3-input-group" style={{marginTop: '16px'}}>
                        <label className={mode === 'member' ? 'floating-label' : 'm3-form-label'}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            className={`${mode === 'member' ? 'pill-input' : 'm3-large-input'} ${errors.password ? 'm3-input-error' : ''}`} 
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="m3-error-text m3-body-small" style={{marginTop: '4px', display: 'block'}}>{errors.password}</span>}
                    </div>

                    {errors.general && (
                        <div className="m3-error-container" style={{marginTop: '20px', padding: '12px', background: 'var(--m3-error-container)', borderRadius: '8px', borderLeft: '4px solid var(--m3-error)'}}>
                            <span className="m3-on-error-container m3-body-medium" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                ⚠️ {errors.general}
                            </span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={mode === 'member' ? 'm3-filled-btn pill-btn' : 'm3-filled-btn standard-btn'}
                        style={{marginTop: '24px', width: '100%'}}
                        disabled={loading}
                    >
                        {loading ? 'Verifying Identity...' : 'Log In'}
                    </button>
                </form>

                {mode === 'member' && (
                    <footer className="login-footer">
                        <span className="m3-body-small">Not a registered member? </span>
                        <button
                            id="btn-contact-officer"
                            className="m3-text-btn m3-body-small"
                            onClick={() => setShowRegister(true)}
                        >
                            Contact Officer
                        </button>
                    </footer>
                )}

                {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
            </div>
        </div>
    );
}
