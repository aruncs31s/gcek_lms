import { Link } from 'react-router-dom';
import { BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Enrolment {
    course_id: string;
    course_title: string;
    course_thumbnail_url: string;
    status: string;
    progress_percentage: number;
    enrolled_at: string;
}

interface EnrolledCoursesSectionProps {
    enrolments: Enrolment[];
}

export default function EnrolledCoursesSection({ enrolments }: EnrolledCoursesSectionProps) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <BookOpenIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Enrolled Courses</h2>
            </div>

            {(!enrolments || enrolments.length === 0) ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p className="text-muted">No courses enrolled yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {enrolments.map(enrolment => (
                        <Link to={`/courses/${enrolment.course_id}`} key={enrolment.course_id} className="stat-box" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left', textDecoration: 'none' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: enrolment.course_thumbnail_url ? `url(${enrolment.course_thumbnail_url}) center/cover` : 'var(--bg-tertiary)', border: '1px solid var(--border-color)', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{enrolment.course_title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, background: 'var(--bg-tertiary)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${Math.min(enrolment.progress_percentage || 0, 100)}%`, background: 'var(--brand-primary)', height: '100%' }} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{Math.round(enrolment.progress_percentage || 0)}%</span>
                                </div>
                            </div>
                            {enrolment.status === 'completed' && <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--success)', flexShrink: 0 }} />}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
