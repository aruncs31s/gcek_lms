import { Link } from 'react-router-dom';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { User } from '../../models/user';

interface ProfileOverviewCardProps {
    user: User;
    points: number;
    isOwnProfile: boolean;
}

export default function ProfileOverviewCard({ user, points, isOwnProfile }: ProfileOverviewCardProps) {
    const badgeStyle = user.badgeStyle;

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
                <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                {user.fullName}
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
                <span className="badge" style={{ ...badgeStyle, fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
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
