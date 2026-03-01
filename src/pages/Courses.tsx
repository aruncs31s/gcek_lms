import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { FunnelIcon, MagnifyingGlassIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    type: string;
    format?: string;
    status: string;
    duration?: string;
    start_date?: string;
    progress?: number;
    teacher_name?: string;
    student_count?: number;
    likes_count?: number;
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const format = searchParams.get('format') || '';
    const status = searchParams.get('status') || '';

    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await api.get('/courses', {
                    params: { query, type, format, status }
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [query, type, format, status]);

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('query', localQuery);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Section */}
            <div className="glass-panel search-hero-section" style={{ padding: '4rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.08) 0%, rgba(245, 194, 231, 0.03) 100%)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(203, 166, 247, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>Explore Our Courses</h1>
                    <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
                        Broaden your horizons with expert-led courses in Embedded Systems, IoT, and cutting-edge digital technologies.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '2.5rem auto 1rem auto', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <MagnifyingGlassIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="What do you want to learn today?"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            style={{ paddingLeft: '3rem', paddingRight: '8rem', height: '3.5rem', fontSize: '1.1rem', borderRadius: '999px', background: 'var(--bg-primary)' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.4rem', top: '0.4rem', bottom: '0.4rem', borderRadius: '999px', padding: '0 1.5rem' }}>
                            Search
                        </button>
                    </form>

                    {/* Filter Bar */}
                    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem', maxWidth: 'fit-content', margin: '1.5rem auto 0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>
                            <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters</span>
                        </div>
                        <select
                            className="form-input"
                            style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                            value={type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="free">Free Courses</option>
                            <option value="paid">Premium Courses</option>
                        </select>

                        <select
                            className="form-input"
                            style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                            value={format}
                            onChange={(e) => handleFilterChange('format', e.target.value)}
                        >
                            <option value="">All Formats</option>
                            <option value="course">Standard Courses</option>
                            <option value="project">Project-Based Courses</option>
                        </select>

                        <select
                            className="form-input"
                            style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                            value={status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="coming soon">Coming Soon</option>
                            <option value="active">Active</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading awesome courses...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
                    {query ? (
                        <>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>No results found for "{query}"</h3>
                            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Try adjusting your search or filters.</p>
                            <button onClick={() => { setSearchParams(new URLSearchParams()); }} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Clear All Filters</button>
                        </>
                    ) : (
                        <>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>No Courses Available</h3>
                            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Check back later for new content.</p>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-card-img-wrapper">
                                <div className="course-card-image" style={{ background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)' }} />
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {course.type === 'free' || course.price === 0 ? (
                                        <span className="badge badge-success badge-blur">Free</span>
                                    ) : (
                                        <span className="badge badge-primary badge-blur">Premium</span>
                                    )}
                                    <span className="badge badge-blur" style={{
                                        textTransform: 'capitalize',
                                        background: course.status === 'coming soon' ? 'rgba(250, 176, 5, 0.2)' : course.status === 'active' ? 'rgba(166, 227, 161, 0.15)' : undefined,
                                        color: course.status === 'coming soon' ? 'var(--warning)' : course.status === 'active' ? 'var(--success)' : undefined,
                                    }}>
                                        {course.status === 'coming soon' ? 'Coming Soon' : (course.status || 'Not Started')}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.4, color: 'var(--text-primary)' }}>{course.title}</h3>
                                {course.teacher_name && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                        <UserIcon style={{ width: '1rem' }} />
                                        <span>{course.teacher_name}</span>
                                    </div>
                                )}

                                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                    {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description || "No description provided."}
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <UsersIcon style={{ width: '1.1rem' }} />
                                        <span>{course.student_count || 0} Students</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <HeartSolidIcon style={{ width: '1.1rem', color: 'var(--danger)' }} />
                                        <span>{course.likes_count || 0} Likes</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                        {course.price === 0 || course.type === 'free' ? 'Free' : `$${course.price}`}
                                    </span>
                                    <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}>
                                        View Content
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
