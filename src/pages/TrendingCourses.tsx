import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { FolderIcon } from '@heroicons/react/24/outline';
import Pagination from '../components/Pagination';
import CourseCard from '../components/CourseCard';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    teacher_name: string;
    likes_count: number;
    student_count: number;
    price: number;
    type: string;
    format?: string;
    status: string;
    duration?: string;
    start_date?: string;
    progress?: number;
}

export default function TrendingCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

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
            <div className="glass-panel search-hero-section" style={{ padding: '3rem 2rem', marginBottom: '3rem', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(243, 139, 168, 0.05) 0%, rgba(203, 166, 247, 0.05) 100%)', border: '1px solid var(--border-color)' }}>
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
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
                        {courses.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((course, index) => {
                            const globalIndex = (currentPage - 1) * pageSize + index;
                            return (
                                <CourseCard key={course.id} course={course} variant="trending" ranking={globalIndex + 1} />
                            )
                        })}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(courses.length / pageSize)}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setCurrentPage(1);
                        }}
                    />
                </>
            )}
        </div>
    );
}
