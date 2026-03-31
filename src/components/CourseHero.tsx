import { UserIcon, DocumentTextIcon, ClockIcon, AcademicCapIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { FiCalendar, FiLayers } from 'react-icons/fi';
import { Course } from '../models/course';
import { Module } from '../models/module';

interface CourseHeroProps {
    course: Course;
    modulesCount: number;
    modules?: Module[];
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    'active': { bg: 'rgba(166,227,161,0.15)', color: 'var(--success)', label: 'Active' },
    'not started': { bg: 'rgba(203,166,247,0.15)', color: 'var(--brand-primary)', label: 'Coming Soon' },
    'completed': { bg: 'rgba(137,180,250,0.15)', color: '#89b4fa', label: 'Completed' },
};



export default function CourseHero({ course, modulesCount, modules = [] }: CourseHeroProps) {
    const statusStyle = STATUS_STYLES[course.status?.toLowerCase()] ?? STATUS_STYLES['active'];
    // Always show ESDC Masterclass as format label
    const formatInfo = { emoji: '📚', label: 'ESDC Masterclass' };
    const videoCount = modules.filter(m => m.isVideo).length;
    const pdfCount = modules.filter(m => m.isPdf).length;

    return (
        <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px var(--border-color)',
        }}>
            {/* Background layers */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${course.thumbnail})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(2px) saturate(1.2)',
                transform: 'scale(1.05)',
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: course.thumbnailUrl
                    ? 'linear-gradient(130deg, rgba(17,17,27,0.97) 0%, rgba(17,17,27,0.93) 50%, rgba(17,17,27,0.82) 100%)'
                    : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
            }} />

            {/* Decorative accent blobs */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(203,166,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(137,180,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, padding: '3.5rem 3rem 3rem' }}>
                {/* Top badges row */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Format badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(203,166,247,0.15)', border: '1px solid rgba(203,166,247,0.3)', color: 'var(--brand-primary)', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {formatInfo.emoji} {formatInfo.label}
                    </span>

                    {/* Status badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: statusStyle.bg, border: `1px solid ${statusStyle.color}40`, color: statusStyle.color, padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.color, display: 'inline-block' }} />
                        {statusStyle.label}
                    </span>

                    {/* Free/Paid badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: course.isFree ? 'rgba(166,227,161,0.15)' : 'rgba(249,226,175,0.15)', border: `1px solid ${course.isFree ? 'rgba(166,227,161,0.3)' : 'rgba(249,226,175,0.3)'}`, color: course.isFree ? 'var(--success)' : '#f9e2af', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {course.isFree ? '🎁 Free' : `💰 ₹${course.price}`}
                    </span>

                    {course.certificateAvailable && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(137,180,250,0.12)', border: '1px solid rgba(137,180,250,0.25)', color: '#89b4fa', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            🏆 Certificate
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15, color: '#fff', textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
                    {course.title}
                </h1>

                {/* Instructor line */}
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500 }}>
                    Instructed by{' '}
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{course.teacherName}</span>
                </p>

                {/* Meta pills row */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Students */}
                    <MetaPill icon={<UserIcon style={{ width: '1.1rem', color: 'var(--brand-primary)' }} />} value={course.studentCount.toLocaleString()} label="Students" />

                    {/* Videos */}
                    {videoCount > 0 && (
                        <MetaPill icon={<DocumentTextIcon style={{ width: '1.1rem', color: 'var(--brand-secondary)' }} />} value={videoCount} label="Videos" />
                    )}

                    {/* PDFs */}
                    {pdfCount > 0 && (
                        <MetaPill icon={<DocumentArrowDownIcon style={{ width: '1.1rem', color: '#f59e0b' }} />} value={pdfCount} label="PDFs" />
                    )}

                    {/* Total modules if no breakdown */}
                    {videoCount === 0 && pdfCount === 0 && (
                        <MetaPill icon={<FiLayers style={{ width: '1.1rem', color: 'var(--brand-secondary)' }} />} value={modulesCount} label="Modules" />
                    )}

                    {/* Duration */}
                    {course.duration && (
                        <MetaPill icon={<ClockIcon style={{ width: '1.1rem', color: 'var(--success)' }} />} value={course.duration} label="" />
                    )}

                    {/* Likes */}
                    <MetaPill icon={<HeartSolidIcon style={{ width: '1.1rem', color: 'var(--danger)' }} />} value={course.likesCount} label="Likes" />

                    {/* Certificate */}
                    {course.certificateAvailable && (
                        <MetaPill icon={<AcademicCapIcon style={{ width: '1.1rem', color: '#89b4fa' }} />} value="Certificate" label="" />
                    )}

                    {/* Start date */}
                    {course.startDate && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(166,227,161,0.12)', border: '1px solid rgba(166,227,161,0.25)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                            <FiCalendar style={{ width: '1rem', color: 'var(--success)' }} />
                            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.88rem' }}>
                                Starts {new Date(course.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetaPill({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
            {icon}
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{value}</span>
            {label && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{label}</span>}
        </div>
    );
}
