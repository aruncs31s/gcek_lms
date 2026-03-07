import { UserIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { FiAward, FiCalendar } from 'react-icons/fi';
import type { Course } from '../types/course';

interface CourseHeroProps {
    course: Course;
    modulesCount: number;
}

export default function CourseHero({ course, modulesCount }: CourseHeroProps) {
    return (
        <div className="course-detail-hero glass-panel" style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: course.thumbnail_url
                ? `linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(30, 30, 46, 0.85) 50%, rgba(30, 30, 46, 0.75) 100%), url(${course.thumbnail_url}) center/cover`
                : 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
            padding: '3.5rem 2.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px var(--border-color)',
            border: '1px solid var(--border-color)',
        }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(203, 166, 247, 0.15)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(203, 166, 247, 0.3)' }}>
                    <FiAward style={{ width: '1rem', height: '1rem', color: 'var(--brand-primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-primary)' }}>ESDC Masterclass</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15, color: 'var(--text-primary)', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{course.title}</h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500 }}>Instructed by <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{course.teacher_name}</span></p>

                <div className="course-meta" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--brand-primary)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.student_count}</span>
                        <span style={{ fontSize: '0.9rem' }}>Students</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <DocumentTextIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--brand-secondary)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{modulesCount}</span>
                        <span style={{ fontSize: '0.9rem' }}>Modules</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <HeartSolidIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--danger)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.likes_count}</span>
                        <span style={{ fontSize: '0.9rem' }}>Likes</span>
                    </div>
                    {course.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--success)' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.duration}</span>
                        </div>
                    )}
                    {course.start_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(166, 227, 161, 0.15)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid rgba(166, 227, 161, 0.3)' }}>
                            <FiCalendar style={{ width: '1.1rem', height: '1.1rem', color: 'var(--success)' }} />
                            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>Starts {new Date(course.start_date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
