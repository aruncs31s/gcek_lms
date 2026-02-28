import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    type: string;
    status: string;
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await api.get('/courses', {
                    params: { query, type, status }
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [query, type, status]);

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Section */}
            <div className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.05) 0%, rgba(245, 194, 231, 0.05) 100%)', border: '1px solid var(--border-color)' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>Explore Our Courses</h1>
                <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
                    Broaden your horizons with expert-led courses in Embedded Systems, IoT, and cutting-edge digital technologies.
                </p>

                {/* Search / Filter Bar */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: 'fit-content', margin: '2.5rem auto 0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters</span>
                    </div>
                    <select
                        className="form-input"
                        style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                        value={type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="free">Free Courses</option>
                        <option value="paid">Premium Courses</option>
                    </select>

                    <select
                        className="form-input"
                        style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                        value={status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="not started">Not Started</option>
                        <option value="active">Active</option>
                        <option value="ended">Ended</option>
                    </select>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
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
                                    <span className="badge badge-blur" style={{ textTransform: 'capitalize' }}>
                                        {course.status || 'Not Started'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 1rem 0', lineHeight: 1.4, color: 'var(--text-primary)' }}>{course.title}</h3>

                                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                    {course.description.length > 120 ? `${course.description.substring(0, 120)}...` : course.description || "No description provided."}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                        {course.price === 0 || course.type === 'free' ? 'Free' : `₹${course.price}`}
                                    </span>
                                    <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}>
                                        View Details
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
