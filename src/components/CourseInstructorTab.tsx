import { UserIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Course } from '../models/course';

interface CourseInstructorTabProps {
    course: Course;
}

export default function CourseInstructorTab({ course }: CourseInstructorTabProps) {
    return (
        <div className="animate-fade-in">
            {/* Instructor hero card */}
            <div style={{
                background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2.5rem',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative blob */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(203,166,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    {/* Avatar with gradient ring */}
                    <div style={{ flexShrink: 0, position: 'relative' }}>
                        <div style={{
                            width: '110px', height: '110px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                            padding: '3px',
                            boxShadow: '0 8px 30px rgba(203,166,247,0.3)',
                        }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {course.teacherAvatarUrl ? (
                                    <img
                                        src={course.teacherAvatarUrl}
                                        alt={course.teacherName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <UserIcon style={{ width: '3.5rem', height: '3.5rem', color: 'var(--text-muted)' }} />
                                )}
                            </div>
                        </div>
                        {/* Verified badge */}
                        <div style={{
                            position: 'absolute', bottom: '4px', right: '4px',
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: 'var(--brand-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--bg-secondary)',
                        }}>
                            <CheckIcon style={{ width: '1rem', height: '1rem', color: '#fff' }} />
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 0.3rem', color: 'var(--text-primary)' }}>
                            {course.teacherName || 'Instructor'}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <AcademicCapIcon style={{ width: '1rem' }} />
                            ESDC Expert & Course Creator
                        </p>

                        {/* Stat pills */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <StatPill icon={<UsersIcon style={{ width: '1rem' }} />} value={course.studentCount?.toLocaleString() || '0'} label="Students" />
                            <StatPill icon={<BookOpenIcon style={{ width: '1rem' }} />} value="1" label="Course" />
                            <StatPill icon={<StarIcon style={{ width: '1rem' }} />} value="Verified" label="Instructor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio section */}
            <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2rem',
            }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpenIcon style={{ width: '1.2rem', color: 'var(--brand-primary)' }} />
                    About the Instructor
                </h4>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    {course.teacherBio || "This instructor is an expert in their field and is passionate about sharing knowledge with students. Stay tuned for more details about their background and experience."}
                </p>
            </div>
        </div>
    );
}

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        </div>
    );
}
