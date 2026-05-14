import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On startup, verify the session is still valid with the backend.
        // localStorage is only used as a hint — the backend /api/auth/me is
        // the source of truth. This prevents stale sessions from auto-logging in.
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            // No stored user — go straight to login.
            setLoading(false);
            return;
        }

        // We have a stored user — verify the session is still alive on the server.
        fetch('/api/auth/me', { credentials: 'include' })
            .then(res => {
                if (res.ok) {
                    return res.json().then(userData => {
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    });
                } else {
                    // Session expired or server restarted — clear and show login.
                    localStorage.removeItem('user');
                }
            })
            .catch(() => {
                // Backend unreachable — clear session to be safe.
                localStorage.removeItem('user');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Important for session cookies
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                const errorText = await response.text();
                return { success: false, message: errorText || 'Login failed' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: 'Network error. Could not connect to the server.' };
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            credentials: 'include' // Always send cookies
        });

        if (response.status === 401 || response.status === 403) {
            // Session expired mid-session — force logout
            setUser(null);
            localStorage.removeItem('user');
        }

        return response;
    };

    const logout = async () => {
        try {
            // Tell the backend to invalidate the server-side session
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            // Ignore network errors on logout
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

