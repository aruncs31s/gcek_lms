import { useEffect, useMemo,useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardCourseRow from '../components/DashboardCourseRow';
import {
    BookOpenIcon,
    DocumentCheckIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    PlusIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { CourseRepository } from '../repositories/courseRepository';

import { Course } from '../types/course';

export default function Dashboard() {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);


    const courseRepository = useMemo(() => new CourseRepository(), []);

    useEffect(() => {
    async function load() {
        setLoading(true);
        const courses = await courseRepository.getCourses();
        setCourses(courses);
        setLoading(false);
    }

    load();
    }, [courseRepository]);


    const [searchParams, setSearchParams] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredCourses = courses.filter(course => {
        const matchesQuery = course.title.toLowerCase().includes(searchParams.toLowerCase()) ||
            course.description.toLowerCase().includes(searchParams.toLowerCase());
        const matchesStatus = statusFilter === '' || course.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    if (!user) return <div style={{ textAlign: 'center', padding: '5rem' }}>Please log in to view your dashboard.</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Area */}
            <div className="page-header-flex" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Dashboard</h1>
                    <p className="text-secondary" style={{ fontSize: '1.1rem', margin: 0 }}>
                        Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user.firstName}</span>! Here's your overview as a <span style={{ textTransform: 'capitalize', color: 'var(--brand-primary)', fontWeight: 600 }}>{user.role}</span>.
                    </p>
                </div>
                {user.role && (user.role === 'admin' || user.role === 'teacher') && (
                    <Link to="/courses/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', padding: '0.75rem 1.5rem' }}>
                        <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        Create New Course
                    </Link>
                )}
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                {[
                    { label: 'Active Courses', value: courses.length, icon: BookOpenIcon, color: 'var(--brand-primary)' },
                    { label: 'Certificates Earned', value: '0', icon: DocumentCheckIcon, color: 'var(--success)' },
                    { label: 'Unread Messages', value: '0', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'var(--warning)' }
                ].map((stat, i) => (
                    <div key={i} className="stat-box" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                        <div style={{ padding: '1rem', background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, borderRadius: '16px', color: stat.color }}>
                            <stat.icon style={{ width: '2rem', height: '2rem' }} />
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{stat.label}</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, lineHeight: 1, color: 'var(--text-primary)' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Courses List */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Recent Courses</h2>

                    <div className="dashboard-filters" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, maxWidth: '500px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <div className="search-container" style={{ maxWidth: '240px' }}>
                            <input
                                type="text"
                                placeholder="Filter your courses..."
                                className="form-input"
                                style={{ padding: '0.5rem 1rem', paddingRight: '2.5rem', fontSize: '0.9rem' }}
                                value={searchParams}
                                onChange={(e) => setSearchParams(e.target.value)}
                            />
                            <div className="search-icon" style={{ right: '0.75rem' }}>
                                <ArrowRightIcon style={{ width: '1rem', height: '1rem', transform: 'rotate(-45deg)' }} />
                            </div>
                        </div>
                        <select
                            className="form-input"
                            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', minWidth: '140px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="not started">Not Started</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>

                    <Link to="/courses" className="text-gradient" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        View all <ArrowRightIcon style={{ width: '1rem', height: '1rem' }} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem 0', color: 'var(--text-secondary)' }}>Loading your courses...</div>
                ) : filteredCourses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                        <BookOpenIcon style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No courses found</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Try adjusting your filter or search.</p>
                        <Link to="/courses" className="btn btn-secondary">Explore Courses</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredCourses.slice(0, 5).map(course => (
                            <DashboardCourseRow
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                thumbnail_url={course.thumbnailUrl}
                                status={course.status}
                                type={course.type}
                                price={course.price}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
