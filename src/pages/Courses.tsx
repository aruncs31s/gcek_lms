import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Explore Courses</h1>
                <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Broaden your horizons with expert-led courses in Embedded Systems and cutting-edge technologies.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading courses...</div>
            ) : courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '1.25rem' }}>No courses available yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {courses.map(course => (
                        <div key={course.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '160px', background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)' }} />

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{course.title}</h3>
                                    <span style={{ fontWeight: 700, color: 'var(--brand-secondary)' }}>
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </span>
                                </div>

                                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                    {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description || "No description provided."}
                                </p>

                                <Link to={`/courses/${course.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
