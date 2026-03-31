import { Link } from 'react-router-dom';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';
import type { Course } from '../../models/course';

interface CreatedCoursesSectionProps {
    courses: Course[];
}

export default function CreatedCoursesSection({ courses }: CreatedCoursesSectionProps) {
    return (
        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <PresentationChartBarIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Courses Created ({courses.length})</h2>
            </div>

            {/* Empty State */}
            {courses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p className="text-muted">No courses created yet.</p>
                </div>
            ) : (

                /* Grid Layout */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <Link
                            to={`/courses/${course.id}`}
                            key={course.id}
                            className="stat-box hover-card-effect"
                            style={{ padding: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column', textDecoration: 'none' }}
                        >
                            {/* Thumbnail Container */}
                            <div style={{
                                width: '100%',
                                height: '140px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Safely render image if it exists */}
                                {/* {course.thumbnailUrl && ( */}
                                <img
                                    src={course.thumbnail}
                                    alt={`${course.title} thumbnail`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {/* )} */}

                                {/* Status Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em'
                                }}>
                                    {course.status?.toUpperCase()}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                                    {course.title}
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>{course.studentCount || 0} Students</span>
                                    <span style={{ fontWeight: '600', color: course.price === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                                        {/* Added .toFixed(2) to ensure prices like 19.9 format as 19.90 */}
                                        {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
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