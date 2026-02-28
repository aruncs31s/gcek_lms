import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { FolderIcon, UserIcon } from '@heroicons/react/24/outline';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    teacher_name: string;
    likes_count: number;
    student_count: number;
    price: number;
}

export default function TrendingCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.get('/courses/trending');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load trending courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading trending courses...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Section */}
            <div className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(243, 139, 168, 0.05) 0%, rgba(203, 166, 247, 0.05) 100%)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <HeartSolidIcon style={{ width: '3rem', height: '3rem', color: 'var(--danger)' }} />
                </div>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>Trending Courses</h1>
                <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
                    Discover the most loved and highly-rated embedded systems courses by the community.
                </p>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                    <FolderIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>No trending courses yet</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Check back later as our community grows!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {courses.map((course, index) => (
                        <Link to={`/courses/${course.id}`} key={course.id} className="stat-box hover-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                            <div style={{ height: '180px', background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(24, 24, 37, 0.8)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <HeartSolidIcon style={{ width: '1rem', height: '1rem', color: 'var(--danger)' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{course.likes_count}</span>
                                </div>
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#000' }}>#{index + 1}</span>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                                        {course.title}
                                    </h3>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {course.description || "Learn amazing skills in this course."}
                                </p>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <UserIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                                        <span>{course.student_count} Enrolled</span>
                                    </div>
                                    <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.1rem' }}>
                                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
