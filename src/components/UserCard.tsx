import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline';

interface UserProps {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        avatar_url: string;
        type: string;
    };
}

export default function UserCard({ user }: UserProps) {
    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return { background: 'rgba(243, 139, 168, 0.15)', color: 'var(--danger)', border: '1px solid rgba(243, 139, 168, 0.3)' };
            case 'teacher':
                return { background: 'rgba(203, 166, 247, 0.15)', color: 'var(--brand-primary)', border: '1px solid rgba(203, 166, 247, 0.3)' };
            case 'student':
            default:
                return { background: 'rgba(166, 227, 161, 0.15)', color: 'var(--success)', border: '1px solid rgba(166, 227, 161, 0.3)' };
        }
    };

    return (
        <Link to={`/users/${user.id}`} className="stat-box" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <UserIcon style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-muted)' }} />
                )}
            </div>

            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                    {user.first_name} {user.last_name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {user.email}
                </p>

                <span className="badge" style={{ ...getRoleBadgeStyle(user.role), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {user.role}
                </span>
            </div>
        </Link>
    );
}
