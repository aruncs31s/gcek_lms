import { Link } from 'react-router-dom';
import type { User } from '../types/user';

interface UserProps {
    user: User;
}   


export default function UserCard({ user }: UserProps) {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.style.display = 'none';
    };

    return (
        console.log("Rendering UserCard for user:", user.avatar),
        <Link to={`/users/${user.id}`} className="stat-box" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img 
                    src={user.avatar} 
                    alt={user.firstName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={handleImageError}
                />
                {/* <UserIcon style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-muted)', position: 'absolute' }} /> */}
            </div>

            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                    {user.firstName} {user.lastName}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {user.email}
                </p>

                <span className="badge" style={{ ...user.badgeStyle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {user.role}
                </span>
            </div>
        </Link>
    );
}
