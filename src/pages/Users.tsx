import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { UserIcon, FunnelIcon, ClockIcon } from '@heroicons/react/24/outline';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    avatar_url: string;
    type: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'teacher' | 'student'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'all'>('recent');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Fetch up to 100 users for this simple view
                const res = await api.get('/users', {
                    params: {
                        user_type: filterRole === 'all' ? '' : filterRole,
                        limit: 100,
                        offset: 0
                    }
                });

                let fetchedUsers = res.data.users || [];

                // If "recently joined", reverse the array (assuming db returns newest last without explicit order by)
                if (sortBy === 'recent') {
                    fetchedUsers = [...fetchedUsers].reverse();
                }

                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [filterRole, sortBy]);

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
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Section */}
            <div className="glass-panel search-hero-section" style={{ padding: '3rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.05) 0%, rgba(245, 194, 231, 0.05) 100%)', border: '1px solid var(--border-color)' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>Community Members</h1>
                <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
                    Connect with fellow students, expert instructors, and platform administrators.
                </p>

                {/* Filter Bar */}
                <div className="filter-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: 'fit-content', margin: '2.5rem auto 0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters</span>
                    </div>

                    <select
                        className="form-input"
                        style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="admin">Administrators</option>
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginLeft: '1rem' }}>
                        <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort</span>
                    </div>

                    <select
                        className="form-input"
                        style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="recent">Recently Joined</option>
                        <option value="all">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading community members...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                    <UserIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>No members found</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Try adjusting your role filters to see more results.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
                    {users.map(user => (
                        <Link to={`/users/${user.id}`} key={user.id} className="stat-box" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
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
                    ))}
                </div>
            )}
        </div>
    );
}
