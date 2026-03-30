import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, AcademicCapIcon, CheckBadgeIcon, DocumentArrowDownIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, HeartIcon } from '@heroicons/react/24/solid';
import { Course } from '../models/course';
import { Module } from '../models/module';
import { User } from '../models/user';

interface Enrollment {
    enrolled: boolean;
    progress_percentage?: number;
}

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

// SVG circular progress ring
function ProgressRing({ pct }: { pct: number }) {
    const radius = 52;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: `${radius * 2}px`, height: `${radius * 2}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                {/* Track */}
                <circle
                    cx={radius} cy={radius} r={normalizedRadius}
                    stroke="var(--border-color)" strokeWidth={stroke} fill="none"
                />
                {/* Progress */}
                <circle
                    cx={radius} cy={radius} r={normalizedRadius}
                    stroke={pct === 100 ? 'var(--success)' : 'var(--brand-primary)'}
                    strokeWidth={stroke} fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
                />
            </svg>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: pct === 100 ? 'var(--success)' : 'var(--text-primary)', lineHeight: 1 }}>{Math.round(pct)}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>DONE</div>
            </div>
        </div>
    );
}

export default function CourseActionCard({
    course, user, isTeacher, isEnrolled, enrollment, enrolling, liking,
    modules, handleEnroll, handleLikeToggle, requestCertificate, setActiveTab
}: CourseActionCardProps) {
    const progressPct = course.progress ?? enrollment?.progress_percentage ?? 0;
    const videoCount = modules.filter(m => m.isVideo).length;
    const pdfCount = modules.filter(m => m.isPdf).length;

    const highlights = [
        videoCount > 0 ? { icon: <VideoCameraIcon style={{ width: '1.2rem', color: 'var(--brand-secondary)' }} />, text: `${videoCount} video lesson${videoCount !== 1 ? 's' : ''}` } : null,
        pdfCount > 0 ? { icon: <DocumentArrowDownIcon style={{ width: '1.2rem', color: '#f59e0b' }} />, text: `${pdfCount} PDF resource${pdfCount !== 1 ? 's' : ''}` } : null,
        { icon: <ClockIcon style={{ width: '1.2rem', color: 'var(--success)' }} />, text: 'Learn at your own pace' },
        course.certificateAvailable ? { icon: <AcademicCapIcon style={{ width: '1.2rem', color: '#89b4fa' }} />, text: 'Verifiable digital certificate' } : null,
        course.duration ? { icon: <ClockIcon style={{ width: '1.2rem', color: 'var(--text-muted)' }} />, text: `Duration: ${course.duration}` } : null,
    ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

    return (
        <div className="course-action-col" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
            }}>
                {/* Thumbnail strip */}
                {course.thumbnailUrl && (
                    <div style={{ width: '100%', height: '150px', backgroundImage: `url(${course.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg-secondary) 100%)' }} />
                    </div>
                )}

                <div style={{ padding: '1.75rem' }}>
                    {/* Price / status header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        {(isEnrolled || isTeacher) ? (
                            <>
                                {isTeacher ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <CheckBadgeIcon style={{ width: '1.6rem', color: 'var(--brand-primary)' }} />
                                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-primary)' }}>You're the Instructor</span>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                            <ProgressRing pct={progressPct} />
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <CheckCircleIcon style={{ width: '1.3rem' }} /> Enrolled!
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                                                    {modules.filter(m => m.isVideo && m.isCompleted).length} / {videoCount} videos done
                                                </div>
                                                {progressPct === 100 && (
                                                    <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.3rem' }}>🎉 Course Complete!</div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.4rem' }}>
                                    {course.isFree ? <span style={{ color: 'var(--success)' }}>Free</span> : `₹${course.price}`}
                                </div>
                                <p style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                    <CheckCircleIcon style={{ width: '1.1rem' }} /> Lifetime Access
                                </p>
                            </>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                        {user ? (
                            <>
                                {isTeacher ? (
                                    <button onClick={() => setActiveTab('settings')} className="btn btn-secondary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>
                                        ⚙️ Manage Course
                                    </button>
                                ) : isEnrolled ? (
                                    <>
                                        <button onClick={() => setActiveTab('curriculum')} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}>
                                            {progressPct > 0 ? '▶ Continue Learning' : '🚀 Start Learning'}
                                        </button>
                                        {progressPct === 100 && course.certificateAvailable && (
                                            <button onClick={requestCertificate} className="btn" style={{ width: '100%', padding: '0.9rem', background: 'rgba(166,227,161,0.1)', border: '1px solid var(--success)', color: 'var(--success)', fontWeight: 700 }}>
                                                🏆 Download Certificate
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}>
                                        {enrolling ? 'Processing...' : course.isFree ? 'Enroll for Free 🎁' : `Enroll Now — ₹${course.price}`}
                                    </button>
                                )}
                                <Link to={`/chat?course=${course.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '0.9rem', display: 'block' }}>
                                    💬 Community Chat
                                </Link>
                                <button
                                    onClick={handleLikeToggle}
                                    disabled={liking}
                                    style={{
                                        width: '100%', padding: '0.75rem',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                                        background: course.isLiked ? 'rgba(243,139,168,0.1)' : 'transparent',
                                        border: `1px solid ${course.isLiked ? 'var(--danger)' : 'var(--border-color)'}`,
                                        borderRadius: '10px',
                                        color: course.isLiked ? 'var(--danger)' : 'var(--text-secondary)',
                                        cursor: liking ? 'wait' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '0.9rem', fontWeight: 600,
                                    }}
                                >
                                    {course.isLiked
                                        ? <HeartSolidIcon style={{ width: '1.1rem', animationName: 'pulse', animationDuration: '0.3s' }} />
                                        : <HeartIcon style={{ width: '1.1rem' }} />
                                    }
                                    {course.isLiked ? 'Liked' : 'Like'} · {course.likesCount}
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, display: 'block' }}>
                                Login to Enroll
                            </Link>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid var(--border-color)', marginBottom: '1.5rem' }} />

                    {/* Course highlights */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {highlights.map(({ icon, text }, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {icon}
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
