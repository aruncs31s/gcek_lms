import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { FiPlus } from 'react-icons/fi';
import Pagination from '../components/Pagination';
import CourseCard from '../components/CourseCard';

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
    const [totalPages, setTotalPages] = useState(1);
    const [totalCourses, setTotalCourses] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const { user } = useAuthStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const format = searchParams.get('format') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await api.get('/courses', {
                    params: { query, type, format, status, page, limit }
                });

                let fetchedCourses = [];
                let total = 0;
                let calculatedTotalPages = 1;

                if (res.data.courses) {
                    fetchedCourses = res.data.courses;
                    total = res.data.total || fetchedCourses.length;
                    calculatedTotalPages = res.data.totalPages || Math.ceil(total / limit);
                } else if (Array.isArray(res.data)) {
                    // API returned a flat array, we need to paginate on the frontend
                    fetchedCourses = res.data;
                    total = fetchedCourses.length;
                    calculatedTotalPages = Math.ceil(total / limit) || 1;

                    // Slice for current page
                    const startIndex = (page - 1) * limit;
                    const endIndex = startIndex + limit;
                    fetchedCourses = fetchedCourses.slice(startIndex, endIndex);
                }

                setCourses(fetchedCourses);
                setTotalPages(calculatedTotalPages);
                setTotalCourses(total);
                setCurrentPage(page);
                setPageSize(limit);
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [query, type, format, status, page, limit]);

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('query', localQuery);
    };

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
    };

    const handlePageSizeChange = (newSize: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('limit', newSize.toString());
        newParams.delete('page');
        setSearchParams(newParams);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div className="glass-panel search-hero-section" style={{ padding: '4rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.08) 0%, rgba(245, 194, 231, 0.03) 100%)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(203, 166, 247, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800, lineHeight: 1.2 }}>Explore Our Courses</h1>
                    <p className="text-secondary" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
                        Broaden your horizons with expert-led courses in Embedded Systems, IoT, and cutting-edge digital technologies.
                    </p>

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

                    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem', maxWidth: 'fit-content', margin: '1.5rem auto 0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>
                            <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters</span>
                        </div>
                        <select className="form-input" style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }} value={type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                            <option value="">All Types</option>
                            <option value="free">Free Courses</option>
                            <option value="paid">Premium Courses</option>
                        </select>
                        <select className="form-input" style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }} value={format} onChange={(e) => handleFilterChange('format', e.target.value)}>
                            <option value="">All Formats</option>
                            <option value="course">Standard Courses</option>
                            <option value="project">Project-Based Courses</option>
                        </select>
                        <select className="form-input" style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }} value={status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="coming soon">Coming Soon</option>
                            <option value="active">Active</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>
            </div>

            {user?.role === 'teacher' && (
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                        {!loading && courses.length > 0 && `Showing ${((currentPage - 1) * pageSize + 1)} - ${Math.min(currentPage * pageSize, totalCourses)} of ${totalCourses} courses`}
                    </div>
                    <Link to="/courses/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                        <FiPlus size={20} /> Create Course
                    </Link>
                </div>
            )}

            {user?.role !== 'teacher' && !loading && courses.length > 0 && (
                <div style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                    Showing {((currentPage - 1) * pageSize + 1)} - {Math.min(currentPage * pageSize, totalCourses)} of {totalCourses} courses
                </div>
            )}

            {loading && courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading awesome courses...</p>
                </div>
            ) : courses.length === 0 && !loading ? (
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
                <div style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto', transition: 'opacity 0.2s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
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
