import { UserIcon } from '@heroicons/react/24/outline';
import type { Course } from '../types/course';

interface CourseInstructorTabProps {
    course: Course;
}

export default function CourseInstructorTab({ course }: CourseInstructorTabProps) {
    return (
        <div className="animate-fade-in instructor-section" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{
                width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {course.teacher_avatar_url ? (
                    <img src={course.teacher_avatar_url} alt={course.teacher_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <UserIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)' }} />
                )}
            </div>
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{course.teacher_name || 'Instructor'}</h3>
                <p style={{ fontSize: '1rem', color: 'var(--brand-primary)', fontWeight: 500, marginBottom: '1rem' }}>Course Creator & Embedded Expert</p>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {course.teacher_bio || "This instructor hasn't provided a bio yet, but they sure know how to build firmware!"}
                </p>
            </div>
        </div>
    );
}
