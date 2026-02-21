import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Module {
    id: string;
    title: string;
    video_url: string;
    order_index: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    teacher_id: string;
    modules: Module[];
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCourse();
    }, [id]);

    const requestCertificate = async () => {
        try {
            const res = await api.post('/certificates/generate', { user_id: user?.id, course_id: course?.id });
            window.open(res.data.file_url, '_blank');
        } catch (err) {
            alert("Error generating certificate");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading course...</div>;
    if (!course) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Course not found</div>;

    const isTeacher = user?.id === course.teacher_id;

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

            {/* Main Content Area */}
            <div>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
                    <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>{course.description}</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Course Modules</h2>
                        {isTeacher && (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>+ Add Module</button>
                        )}
                    </div>

                    {!course.modules || course.modules.length === 0 ? (
                        <p className="text-muted">No modules available yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {course.modules.sort((a, b) => a.order_index - b.order_index).map((m, idx) => (
                                <div key={m.id} className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'var(--bg-secondary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {idx + 1}
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{m.title}</h4>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Watch</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Action Area */}
            <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                </h3>

                {user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isTeacher && <button className="btn btn-primary" style={{ width: '100%' }}>Enroll Now</button>}
                        {!isTeacher && <button onClick={requestCertificate} className="btn btn-secondary" style={{ width: '100%' }}>Request Certificate</button>}
                        <Link to={`/chat?course=${course.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Join Course Chat</Link>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login to Enroll</Link>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                <p className="text-muted" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                    Includes lifetime access and a verifiable certificate of completion.
                </p>
            </div>

        </div>
    );
}
