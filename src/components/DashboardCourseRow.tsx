/**
 * DashboardCourseRow Component - Displays a course row on the dashboard
 * Single Responsibility: Only renders course row UI
 */
import { Link } from 'react-router-dom';
import defaultLogo from '../../public/default_course_logo.png';

interface DashboardCourseRowProps {
    id: string;
    title: string;
    thumbnail_url?: string;
    status: string;
    type: string;
    price: number;
}

export default function DashboardCourseRow({
    id,
    title,
    thumbnail_url,
    status,
    type,
    price
}: DashboardCourseRowProps) {
    return (
        <div
            className="dashboard-course-row"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s',
                flexWrap: 'wrap',
                gap: '1rem'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {/* Course Thumbnail and Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Thumbnail */}
                <div
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundImage: thumbnail_url ? `url(${thumbnail_url})` : `url(${defaultLogo})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid var(--border-color)'
                    }}
                />

                {/* Course Details */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                        {title}
                    </h4>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Status Indicator */}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: status === 'active' ? 'var(--success)' : 'var(--text-muted)'
                                }}
                            ></span>
                            <span style={{ textTransform: 'capitalize' }}>
                                {status || 'Not Started'}
                            </span>
                        </span>

                        {/* Price/Type */}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {type === 'free' || price === 0 ? 'Free' : `$${price}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* View Details Button */}
            <Link
                to={`/courses/${id}`}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
            >
                View Details
            </Link>
        </div>
    );
}
