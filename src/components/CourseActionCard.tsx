import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, DocumentTextIcon, AcademicCapIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Course, Enrollment, Module } from '../types/course';
import type { User } from '../types/user';

interface CourseActionCardProps {
    course: Course;
    user: User | null;
    isTeacher: boolean;
    isEnrolled: boolean;
    enrollment: Enrollment | null;
    enrolling: boolean;
    liking: boolean;
    modules: Module[];
    handleEnroll: () => void;
    handleLikeToggle: () => void;
    requestCertificate: () => void;
    setActiveTab: (tab: 'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings') => void;
}

export default function CourseActionCard({
    course,
    user,
    isTeacher,
    isEnrolled,
    enrollment,
    enrolling,
    liking,
    modules,
    handleEnroll,
    handleLikeToggle,
    requestCertificate,
    setActiveTab
}: CourseActionCardProps) {
    return (
        <div className="course-action-col" style={{ position: 'sticky', top: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden', position: 'relative' }}>
                {course.thumbnail_url && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', backgroundImage: `url(${course.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {(isEnrolled || isTeacher) ? (
                            <>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>
                                    {isTeacher ? 'You are the Instructor' : 'You are Enrolled!'}
                                </h2>
                                {!isTeacher && (
                                    <>
                                        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                                            {course.progress ? course.progress.toFixed(0) : (enrollment?.progress_percentage || 0).toFixed(0)}% Complete
                                        </p>
                                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <div style={{ width: `${course.progress !== undefined ? course.progress : enrollment?.progress_percentage || 0}%`, height: '100%', background: 'var(--success)', transition: 'width 0.3s ease' }}></div>
                                        </div>
                                    </>
                                )}
                                <p style={{ color: 'var(--brand-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                    <CheckCircleIcon style={{ width: '1.2rem' }} /> Full Access Unlocked
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                </h2>
                                <p style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                    <CheckCircleIcon style={{ width: '1.2rem' }} /> Lifetime Access Guarantee
                                </p>
                            </>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {user ? (
                            <>
                                {isTeacher ? (
                                    <button onClick={() => setActiveTab('settings')} className="btn btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>Manage Course</button>
                                ) : isEnrolled ? (
                                    <>
                                        <button onClick={() => setActiveTab('curriculum')} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Continue Learning</button>
                                        {enrollment?.status === 'completed' && (
                                            <button onClick={requestCertificate} className="btn btn-secondary" style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--success)', color: 'var(--success)' }}>Download Certificate</button>
                                        )}
                                    </>
                                ) : (
                                    <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                        {enrolling ? 'Processing...' : 'Enroll Now'}
                                    </button>
                                )}
                                <Link to={`/chat?course=${course.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '1rem' }}>Community Chat</Link>
                                <button
                                    onClick={handleLikeToggle}
                                    disabled={liking}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: course.is_liked ? 'rgba(243, 139, 168, 0.1)' : 'transparent',
                                        border: course.is_liked ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                                        color: course.is_liked ? 'var(--danger)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {course.is_liked ? <HeartSolidIcon style={{ width: '1.2rem' }} /> : <HeartIcon style={{ width: '1.2rem' }} />}
                                    {course.is_liked ? 'Liked' : 'Like'} ({course.likes_count})
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1.1rem' }}>Login to Enroll</Link>
                        )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <ClockIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                            <span>Learn at your own pace</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <DocumentTextIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                            <span>{modules.filter(m => m.type === 'video').length} comprehensive videos</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <AcademicCapIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                            <span>Verifiable digital certificate</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
