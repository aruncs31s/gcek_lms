import { Link } from 'react-router-dom';
import { UserIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface ProfileOverviewCardProps {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        avatar_url: string;
    };
    points: number;
    isOwnProfile: boolean;
}

export default function ProfileOverviewCard({ user, points, isOwnProfile }: ProfileOverviewCardProps) {
    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return { background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' };
            case 'teacher':
                return { background: 'var(--brand-glow-subtle)', color: 'var(--brand-primary)', border: '1px solid var(--brand-glow)' };
            case 'student':
            default:
                return { background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', border: '1px solid rgba(34, 197, 94, 0.3)' };
        }
    };

    return (
        <div className="glass-panel" style={{
            padding: '3rem 2rem',
            marginBottom: '3rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--brand-glow-subtle) 0%, var(--brand-glow-subtler) 100%)',
            border: '1px solid var(--border-color)'
        }}>
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '4px solid var(--bg-secondary)',
                boxShadow: '0 0 0 2px var(--brand-primary)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
            }}>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <UserIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)' }} />
                )}
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                {user.first_name} {user.last_name}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                {user.email}
            </p>

            {isOwnProfile && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/profile/edit" className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Edit Profile
                    </Link>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span className="badge" style={{ ...getRoleBadgeStyle(user.role), fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
                    {user.role}
                </span>
                <span className="badge badge-blur" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
                    <TrophyIcon style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }} />
                    {points} Points
                </span>
            </div>
        </div>
    );
}
