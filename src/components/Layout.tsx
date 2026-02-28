import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NotificationBell from './NotificationBell';

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

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?query=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/courses');
        }
    };

    return (
        <div className="layout-container">
            <nav className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }} className="text-gradient">
                        ESDC LMS
                    </Link>
                    <Link to="/leaderboard" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }} className="hover-text-primary">
                        Leaderboard
                    </Link>
                    <Link to="/users" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }} className="hover-text-primary">
                        Members
                    </Link>
                </div>
                <form onSubmit={handleSearch} className="search-container" style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input"
                    />
                    <button type="submit" className="search-icon" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </form>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle Theme">
                        {isDarkMode ? <SunIcon style={{ width: '1.5rem', height: '1.5rem' }} /> : <MoonIcon style={{ width: '1.5rem', height: '1.5rem' }} />}
                    </button>
                    {user ? (
                        <>
                            <NotificationBell />
                            <span className="text-secondary" style={{ marginLeft: '1rem' }}>Hello, {user.first_name}</span>
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
