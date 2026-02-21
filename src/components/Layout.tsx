import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Layout() {
    const { user, logout } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default dark
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div className="layout-container">
            <nav className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }} className="text-gradient">
                    ESDC LMS
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Theme">
                        {isDarkMode ? <SunIcon style={{ width: '1.5rem', height: '1.5rem' }} /> : <MoonIcon style={{ width: '1.5rem', height: '1.5rem' }} />}
                    </button>
                    {user ? (
                        <>
                            <span className="text-secondary">Hello, {user.first_name}</span>
                            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
