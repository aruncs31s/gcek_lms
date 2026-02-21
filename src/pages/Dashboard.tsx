import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
}

export default function Dashboard() {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        // For MVP, we just fetch all courses. Later, filter by enrolled/created based on role
        const fetchStats = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load dashboard data");
            }
        };
        fetchStats();
    }, []);

    if (!user) return <div>Please log in</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p className="text-secondary">Welcome back, {user.first_name}! Here's your overview as a {user.role}.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Active Courses</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{courses.length}</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Certificates</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>0</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="text-muted" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Unread Messages</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>0</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="text-gradient">Recent Courses</h2>
                    {user.role === 'teacher' && (
                        <Link to="/courses/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Create Course</Link>
                    )}
                </div>

                {courses.length === 0 ? (
                    <p className="text-muted">No courses found right now.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {courses.slice(0, 5).map(course => (
                            <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <div>
                                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{course.title}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{course.description || "No description provided."}</p>
                                </div>
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>View</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
