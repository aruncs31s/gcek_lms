import { AcademicCapIcon, UserIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Course } from '../types/course';

interface CourseHeroProps {
    course: Course;
    modulesCount: number;
}

export default function CourseHero({ course, modulesCount }: CourseHeroProps) {
    return (
        <div className="course-detail-hero" style={{
            position: 'relative',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            background: `linear-gradient(to right, var(--bg-primary) 20%, transparent), url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200'}) center/cover`,
            padding: '4rem 2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
        }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>
                    <AcademicCapIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ESDC Masterclass</span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>{course.title}</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>By {course.teacher_name}</p>

                <div className="course-meta" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        <span>{course.student_count} Enrolled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DocumentTextIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        <span>{modulesCount} Items</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HeartSolidIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--danger)' }} />
                        <span>{course.likes_count} Likes</span>
                    </div>
                    {course.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ClockIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--brand-primary)' }} />
                            <span>{course.duration}</span>
                        </div>
                    )}
                    {course.start_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.8rem', borderRadius: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Starts: {new Date(course.start_date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
