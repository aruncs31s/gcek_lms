import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentTextIcon, AcademicCapIcon, ClockIcon, StarIcon, VideoCameraIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Course } from '../models/course';
import { Module } from '../models/module';
import CertificateGenerator from './CertificateGenerator';

interface CourseOverviewTabProps {
    course: Course;
    isCompleted?: boolean;
    modules?: Module[];
    onGoToCurriculum?: () => void;
}

export default function CourseOverviewTab({ course, isCompleted, modules = [], onGoToCurriculum }: CourseOverviewTabProps) {
    const videoCount = modules.filter(m => m.isVideo).length;
    const pdfCount = modules.filter(m => m.isPdf).length;

    const highlights = [
        { icon: <VideoCameraIcon style={{ width: '1.4rem', color: 'var(--brand-secondary)' }} />, label: 'Video Lessons', value: videoCount > 0 ? `${videoCount} videos` : '—' },
        { icon: <DocumentArrowDownIcon style={{ width: '1.4rem', color: '#f59e0b' }} />, label: 'PDF Resources', value: pdfCount > 0 ? `${pdfCount} PDFs` : '—' },
        { icon: <ClockIcon style={{ width: '1.4rem', color: 'var(--success)' }} />, label: 'Duration', value: course.duration || 'Self-paced' },
        { icon: <AcademicCapIcon style={{ width: '1.4rem', color: '#89b4fa' }} />, label: 'Certificate', value: course.certificateAvailable ? 'Yes, included ✓' : 'Not included' },
        { icon: <StarIcon style={{ width: '1.4rem', color: '#f9e2af' }} />, label: 'Difficulty', value: 'All levels' },
        { icon: <DocumentTextIcon style={{ width: '1.4rem', color: 'var(--brand-primary)' }} />, label: 'Total Modules', value: `${course.modules.length} items` },
    ];

    return (
        <div className="animate-fade-in">
            {/* Course highlights grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {highlights.map(({ icon, label, value }) => (
                    <div key={label} style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.1rem 1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    }}>
                        {icon}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DocumentTextIcon style={{ width: '1.4rem', color: 'var(--brand-primary)' }} />
                    About This Course
                </h3>
                {course.description ? (
                    <div className="markdown-content" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {course.description}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided yet.</p>
                )}
            </div>

            {/* Go to curriculum CTA */}
            {onGoToCurriculum && (
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={onGoToCurriculum}
                        style={{
                            padding: '0.85rem 2rem',
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                            color: '#000',
                            fontWeight: 700, fontSize: '0.95rem',
                            border: 'none', borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 20px var(--brand-glow)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        View Full Curriculum →
                    </button>
                </div>
            )}

            {/* Certificate download if completed */}
            {isCompleted && course.certificateAvailable && (
                <div style={{ marginTop: '1rem' }}>
                    <CertificateGenerator courseId={course.id} courseName={course.title} />
                </div>
            )}
        </div>
    );
}
