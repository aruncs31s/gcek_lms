import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface LeaderboardUser {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    points: number;
    enrolled_courses: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard');
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getMedalColor = (index: number) => {
        if (index === 0) return 'var(--brand-primary)'; // Gold
        if (index === 1) return '#c0c0c0'; // Silver
        if (index === 2) return '#cd7f32'; // Bronze
        return 'transparent';
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Global Leaderboard</h1>
                <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    See who's leading the pack. Complete courses and earn points to climb the ranks!
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading leaderboard...</div>
            ) : users.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '1.25rem' }}>No data available yet.</p>
                </div>
            ) : (
                <div className="leaderboard-container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {users.map((user, index) => (
                        <div
                            key={user.user_id}
                            className="glass-panel leaderboard-row"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.5rem 2rem',
                                gap: '1.5rem',
                                transition: 'transform 0.2s',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {index < 3 && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '6px',
                                    backgroundColor: getMedalColor(index)
                                }} />
                            )}

                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: index < 3 ? getMedalColor(index) : 'var(--text-muted)', minWidth: '40px' }}>
                                #{index + 1}
                            </div>

                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: user.avatar_url ? `url(${user.avatar_url}) center/cover` : 'var(--bg-tertiary)',
                                border: index < 3 ? `2px solid ${getMedalColor(index)}` : 'none'
                            }} />

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                                    {user.enrolled_courses} Course{user.enrolled_courses !== 1 ? 's' : ''} Enrolled
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-secondary)' }}>
                                    {user.points.toLocaleString()}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Points
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
