import { Link } from 'react-router-dom';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';
import type { Course } from '../../models/course';

interface CreatedCoursesSectionProps {
    courses: Course[];
}

export default function CreatedCoursesSection({ courses }: CreatedCoursesSectionProps) {
    return (
        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <PresentationChartBarIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Courses Created ({courses.length})</h2>
            </div>

            {courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p className="text-muted">No courses created yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <Link to={`/courses/${course.id}`} key={course.id} className="stat-box hover-card-effect" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column', textDecoration: 'none' }}>
                            <div style={{ width: '100%', height: '140px', borderRadius: '8px', background: course.thumbnailUrl ? `url(${course.thumbnailUrl}) center/cover` : 'var(--bg-tertiary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {course.status.toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{course.title}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>{course.studentCount || 0} Students</span>
                                    <span style={{ fontWeight: '600', color: course.price === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
