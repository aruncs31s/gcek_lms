import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NotificationBell from './NotificationBell';

export default function Layout() {
    const { user, logout } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default dark
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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
            <nav className="glass-panel navbar">
                <div className="navbar-brand-container">
                    <Link to="/" className="text-gradient navbar-brand">
                        ESDC LMS
                    </Link>

                    <div className="mobile-actions">
                        {user && (
                            <div className="mobile-notification-wrapper">
                                <NotificationBell />
                            </div>
                        )}
                        <button onClick={toggleTheme} className="theme-toggle-btn mobile-theme-btn" aria-label="Toggle Theme">
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
                        </button>
                    </div>
                </div>

                <div className={`navbar-menu ${isMobileMenuOpen ? 'show' : ''}`}>
                    <div className="navbar-links">
                        <Link to="/courses/trending" className="nav-link">Trending</Link>
                        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
                        <Link to="/users" className="nav-link">Members</Link>
                    </div>

                    <form onSubmit={handleSearch} className="search-container navbar-search">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-input"
                        />
                        <button type="submit" className="search-icon">
                            <MagnifyingGlassIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                    </form>

                    <div className="navbar-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn desktop-theme-btn" aria-label="Toggle Theme">
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                        {user ? (
                            <>
                                <div className="desktop-notification-wrapper">
                                    <NotificationBell />
                                </div>
                                <Link to="/profile/edit" className="profile-link hover-card">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="profile-avatar" />
                                    ) : (
                                        <div className="profile-avatar-placeholder">
                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                        </div>
                                    )}
                                    <span className="profile-name">{user.first_name}</span>
                                </Link>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-secondary">Login</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
