interface LeaderboardUser {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    points: number;
    enrolled_courses: number;
}

interface LeaderboardRowProps {
    user: LeaderboardUser;
    globalIndex: number;
}

export default function LeaderboardRow({ user, globalIndex }: LeaderboardRowProps) {
    const getMedalColor = (index: number) => {
        if (index === 0) return 'var(--brand-primary)'; // Gold
        if (index === 1) return '#c0c0c0'; // Silver
        if (index === 2) return '#cd7f32'; // Bronze
        return 'transparent';
    };

    return (
        <div
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
            {globalIndex < 3 && (
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    backgroundColor: getMedalColor(globalIndex)
                }} />
            )}

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: globalIndex < 3 ? getMedalColor(globalIndex) : 'var(--text-muted)', minWidth: '40px' }}>
                #{globalIndex + 1}
            </div>

            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: user.avatar_url ? `url(${user.avatar_url}) center/cover` : 'var(--bg-tertiary)',
                border: globalIndex < 3 ? `2px solid ${getMedalColor(globalIndex)}` : 'none'
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
    );
}
