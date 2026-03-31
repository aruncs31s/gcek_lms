import { Link } from 'react-router-dom';
import { BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Course } from '../../models/course';
import { type EnrolmentDTO } from '../../types/enrolments';

interface EnrolledCoursesSectionProps {
    enrolments: EnrolmentDTO[];
}

export default function EnrolledCoursesSection({ enrolments }: EnrolledCoursesSectionProps) {
    const enrolledCourses = (enrolments || []).map(Course.fromEnrolmentDTO);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <BookOpenIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Enrolled Courses</h2>
            </div>

            {enrolledCourses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p className="text-muted">No courses enrolled yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {enrolledCourses.map(course => (
                        <Link
                            to={`/courses/${course.id}`}
                            key={course.id}
                            className="stat-box"
                            style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left', textDecoration: 'none' }}
                        >
                            {/* Course Thumbnail */}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                background: `url(${course.thumbnail}) center/cover`,
                                border: '1px solid var(--border-color)',
                                flexShrink: 0
                            }} />

                            {/* Course Info */}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                                    {course.title}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, background: 'var(--bg-tertiary)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(course.progress || 0, 100)}%`,
                                            background: 'var(--brand-primary)',
                                            height: '100%'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {Math.round(course.progress || 0)}%
                                    </span>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {course.status === 'completed' && (
                                <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--success)', flexShrink: 0 }} />
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
