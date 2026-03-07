import { Link } from 'react-router-dom';
import { UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CourseProps {
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail_url?: string;
        teacher_name?: string;
        likes_count?: number;
        student_count?: number;
        price: number;
        type: string;
        status: string;
    };
    variant?: 'default' | 'trending';
    ranking?: number;
}

export default function CourseCard({ course, variant = 'default', ranking }: CourseProps) {
    if (variant === 'trending') {
        return (
            <Link to={`/courses/${course.id}`} className="stat-box hover-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                <div style={{ height: '180px', background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(24, 24, 37, 0.8)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <HeartSolidIcon style={{ width: '1rem', height: '1rem', color: 'var(--danger)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{course.likes_count}</span>
                    </div>
                    {ranking && (
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#000' }}>#{ranking}</span>
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                            {course.title}
                        </h3>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.description || "Learn amazing skills in this course."}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <UserIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                            <span>{course.student_count} Enrolled</span>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.1rem' }}>
                            {course.price === 0 ? 'FREE' : `$${course.price}`}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <div className="course-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="course-card-img-wrapper" style={{ position: 'relative' }}>
                <div className="course-card-image" style={{ background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)', height: '200px', width: '100%' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {course.type === 'free' || course.price === 0 ? (
                        <span className="badge badge-success badge-blur">Free</span>
                    ) : (
                        <span className="badge badge-primary badge-blur">Premium</span>
                    )}
                    <span className="badge badge-blur" style={{ textTransform: 'capitalize', background: course.status === 'coming soon' ? 'rgba(250, 176, 5, 0.2)' : course.status === 'active' ? 'rgba(166, 227, 161, 0.15)' : undefined, color: course.status === 'coming soon' ? 'var(--warning)' : course.status === 'active' ? 'var(--success)' : undefined }}>
                        {course.status === 'coming soon' ? 'Coming Soon' : (course.status || 'Not Started')}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.4, color: 'var(--text-primary)' }}>{course.title}</h3>
                {course.teacher_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        <UserIcon style={{ width: '1rem' }} />
                        <span>{course.teacher_name}</span>
                    </div>
                )}
                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                    {course.description?.length > 100 ? `${course.description.substring(0, 100)}...` : course.description || "No description provided."}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <UsersIcon style={{ width: '1.1rem' }} />
                        <span>{course.student_count || 0} Students</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <HeartSolidIcon style={{ width: '1.1rem', color: 'var(--danger)' }} />
                        <span>{course.likes_count || 0} Likes</span>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {course.price === 0 || course.type === 'free' ? 'Free' : `$${course.price}`}
                    </span>
                    <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}>
                        View Content
                    </Link>
                </div>
            </div>
        </div>
    );
}
