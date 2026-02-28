import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PlayCircleIcon, AcademicCapIcon, UserIcon, ClockIcon, DocumentTextIcon, CheckCircleIcon, Bars3Icon, FolderIcon, VideoCameraIcon, LockClosedIcon, CheckBadgeIcon, Cog6ToothIcon, TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Module {
    id: string;
    parent_id?: string;
    title: string;
    description: string;
    type: string; // "video" or "chapter"
    video_url: string;
    points: number;
    is_free: boolean;
    order_index: number;
    is_completed: boolean;
}

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url: string;
    teacher_id: string;
    teacher_name: string;
    teacher_avatar_url: string;
    teacher_bio: string;
    student_count: number;
    modules: Module[];
    type: string;
    status: string;
    duration?: string;
    start_date?: string;
    progress?: number;
    likes_count: number;
    is_liked: boolean;
}

interface Enrollment {
    enrolled: boolean;
    status: string;
    progress_percentage: number;
}

// Sub-component for individual Draggable Module Items
function SortableModuleItem({ module, idx, playingModuleUrl, setPlayingModuleUrl, canWatch, isTeacher, isLocked, isCurrentModule, markCompleted, completingId }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });
    const videoRef = useRef<HTMLVideoElement>(null);

    const isVideo = module.type === 'video';
    const isCompleted = module.is_completed;
    const isAccessible = (canWatch || module.is_free) && !isLocked;

    // Determine visual state
    const getBorderLeft = () => {
        if (!isVideo) return 'none';
        if (isCompleted) return '4px solid var(--success)';
        if (isCurrentModule) return '4px solid var(--brand-primary)';
        if (isLocked) return '4px solid var(--border-color)';
        return '4px solid var(--border-color)';
    };

    const getBackground = () => {
        if (module.type === 'chapter') return 'var(--bg-primary)';
        if (isCompleted) return 'rgba(166, 227, 161, 0.04)';
        if (isCurrentModule) return 'rgba(203, 166, 247, 0.06)';
        return 'var(--bg-secondary)';
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'all 0.3s ease',
        opacity: isDragging ? 0.4 : (isLocked && isVideo && !isTeacher ? 0.45 : 1),
        background: getBackground(),
        border: module.type === 'chapter' ? 'none' : '1px solid var(--border-color)',
        borderLeft: getBorderLeft(),
        borderBottom: module.type === 'chapter' ? '2px solid var(--border-color)' : undefined,
        borderRadius: module.type === 'chapter' ? '0' : '12px',
        overflow: 'hidden' as const,
        position: (isDragging ? 'relative' : 'static') as any,
        zIndex: isDragging ? 100 : 1,
        marginTop: module.type === 'chapter' && idx !== 0 ? '1.5rem' : '0',
        marginLeft: module.parent_id ? '2rem' : '0',
        boxShadow: isCurrentModule && isVideo ? '0 0 0 1px rgba(203, 166, 247, 0.3), 0 4px 20px rgba(203, 166, 247, 0.08)' : 'none',
        filter: isLocked && isVideo && !isTeacher ? 'grayscale(0.3)' : 'none',
        pointerEvents: (isLocked && isVideo && !isTeacher ? 'none' : 'auto') as any,
    };

    const numberBadgeBg = isCompleted ? 'var(--success)' : (isCurrentModule ? 'var(--brand-primary)' : 'var(--bg-tertiary)');
    const numberBadgeColor = isCompleted || isCurrentModule ? '#000' : 'var(--text-secondary)';

    return (
        <div ref={setNodeRef} style={style as React.CSSProperties}>
            {/* Locked overlay for students */}
            {isLocked && isVideo && !isTeacher && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    background: 'rgba(0,0,0,0.25)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '12px', pointerEvents: 'auto', cursor: 'not-allowed'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.6)', padding: '0.6rem 1.5rem', borderRadius: '999px', backdropFilter: 'blur(8px)' }}>
                        <LockClosedIcon style={{ width: '1.1rem', height: '1.1rem', color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>Complete previous module to unlock</span>
                    </div>
                </div>
            )}

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    {isTeacher && (
                        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                            <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    )}

                    {isVideo ? (
                        <>
                            {/* Number badge or completed checkmark */}
                            <div style={{
                                background: numberBadgeBg, color: numberBadgeColor,
                                width: '38px', height: '38px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1rem', flexShrink: 0,
                                transition: 'all 0.3s ease',
                            }}>
                                {isCompleted ? <CheckCircleIcon style={{ width: '1.3rem', height: '1.3rem' }} /> : idx + 1}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h4 style={{
                                    fontSize: '1.1rem', margin: '0 0 0.2rem 0', fontWeight: isCurrentModule ? 600 : 500,
                                    color: isCompleted ? 'var(--success)' : (isCurrentModule ? 'var(--text-primary)' : (isLocked ? 'var(--text-muted)' : 'var(--text-primary)')),
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
                                    transition: 'color 0.2s ease'
                                }}>
                                    {module.title}
                                    {module.is_free && <span style={{ fontSize: '0.65rem', background: 'var(--success)', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}>FREE PREVIEW</span>}
                                    {module.points > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>+{module.points} pts</span>}
                                    {isCurrentModule && !isCompleted && <span style={{ fontSize: '0.65rem', background: 'rgba(203, 166, 247, 0.15)', color: 'var(--brand-primary)', padding: '0.15rem 0.6rem', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}>CURRENT</span>}
                                </h4>
                                {module.description && !isLocked && (
                                    <div className="markdown-content" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{module.description}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.3rem 0', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {module.title}
                            </h3>
                            {module.description && (
                                <div className="markdown-content" style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{module.description}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action buttons for videos */}
                {isVideo && !isLocked && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0, marginLeft: '1rem' }}>
                        {isAccessible && (
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => setPlayingModuleUrl(playingModuleUrl === module.video_url ? null : module.video_url)}
                                className="btn"
                                style={{
                                    background: playingModuleUrl === module.video_url ? 'var(--brand-primary)' : 'transparent',
                                    border: '1px solid var(--brand-primary)',
                                    color: playingModuleUrl === module.video_url ? '#000' : 'var(--brand-primary)',
                                    padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    fontSize: '0.9rem', fontWeight: 600, borderRadius: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <PlayCircleIcon style={{ width: '1.1rem', height: '1.1rem' }} />
                                {playingModuleUrl === module.video_url ? 'Close' : 'Play'}
                            </button>
                        )}

                        {/* Mark Complete button - only for enrolled students (not teachers), on unlocked & unwatched modules */}
                        {!isTeacher && isAccessible && !isCompleted && (
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => markCompleted(module.id)}
                                disabled={completingId === module.id}
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--success)',
                                    color: 'var(--success)',
                                    padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px',
                                    transition: 'all 0.2s ease',
                                    opacity: completingId === module.id ? 0.6 : 1,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <CheckCircleIcon style={{ width: '1.1rem', height: '1.1rem' }} />
                                {completingId === module.id ? 'Saving...' : 'Mark Done'}
                            </button>
                        )}

                        {/* Completed badge */}
                        {isCompleted && !isTeacher && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)',
                                background: 'rgba(166, 227, 161, 0.1)', padding: '0.4rem 0.85rem',
                                borderRadius: '8px', whiteSpace: 'nowrap'
                            }}>
                                <CheckBadgeIcon style={{ width: '1.1rem', height: '1.1rem' }} /> Completed
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Video player area */}
            {playingModuleUrl === module.video_url && isVideo && isAccessible && !isLocked && (
                <div style={{ background: '#000', width: '100%', aspectRatio: '16/9' }} onPointerDown={(e) => e.stopPropagation()}>
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%' }}
                        src={module.video_url}
                        onEnded={() => markCompleted(module.id)}
                    >
                        Your browser does not support HTML video.
                    </video>
                </div>
            )}
        </div>
    );
}

// Inline Curriculum Builder Form
function InlineModuleEditor({ courseId, modules, onSuccess, onCancel }: { courseId: string, modules: Module[], onSuccess: () => void, onCancel: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState<number | ''>('');
    const [isFree, setIsFree] = useState(false);
    const [parentId, setParentId] = useState<string>('');
    const [type, setType] = useState<'video' | 'chapter'>('video');
    const [videoUrl, setVideoUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const form = new FormData();
        form.append('video', file);

        try {
            const res = await api.post('/upload/video', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setVideoUrl(res.data.file_url);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setSaving(true);
        setError('');
        try {
            await api.post(`/courses/${courseId}/modules`, {
                title,
                description,
                points: points === '' ? 0 : Number(points),
                is_free: isFree,
                parent_id: type === 'video' && parentId ? parentId : null,
                type,
                video_url: type === 'video' ? videoUrl : ''
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create module');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }} className="animate-fade-in">
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setType('video')}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: type === 'video' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)', background: type === 'video' ? 'var(--bg-secondary)' : 'transparent', color: type === 'video' ? 'var(--brand-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <VideoCameraIcon style={{ width: '1.2rem' }} /> Video Module
                </button>
                <button
                    onClick={() => setType('chapter')}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: type === 'chapter' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)', background: type === 'chapter' ? 'var(--bg-secondary)' : 'transparent', color: type === 'chapter' ? 'var(--brand-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <FolderIcon style={{ width: '1.2rem' }} /> Chapter Heading
                </button>
            </div>

            <input
                className="input-field"
                placeholder={type === 'chapter' ? "e.g. Module 1: Introduction to Registers" : "e.g. Setting up your environment"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />

            <textarea
                className="input-field"
                placeholder="Description (Markdown supported)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '80px', resize: 'vertical' }}
            />

            {type === 'video' && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <select
                            className="input-field"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">No Parent Chapter</option>
                            {modules.filter(m => m.type === 'chapter').map(c => (
                                <option key={c.id} value={c.id}>Under: {c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Points"
                            value={points}
                            onChange={e => setPoints(e.target.value === '' ? '' : parseInt(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="is_free"
                            checked={isFree}
                            onChange={e => setIsFree(e.target.checked)}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="is_free" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Free Preview</label>
                    </div>
                </div>
            )}

            {type === 'video' && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <input type="file" accept="video/mp4, video/webm" onChange={handleVideoUpload} disabled={uploading} className="input-field" />
                    {uploading && <span style={{ color: 'var(--brand-primary)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Uploading video...</span>}
                    {videoUrl && !uploading && <span style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Video Ready!</span>}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} className="btn btn-secondary" disabled={saving || uploading}>Cancel</button>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={saving || uploading || !title.trim()}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
        </div>
    );
}

// Course Settings Component (For Teachers)
import AssignmentList from '../components/AssignmentList';
import { useNavigate } from 'react-router-dom';

function CourseSettingsForm({ course, onSuccess }: { course: Course, onSuccess: () => void }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [price, setPrice] = useState(course.price.toString());
    const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnail_url || '');
    const [type, setType] = useState(course.type || 'paid');
    const [status, setStatus] = useState(course.status || 'not started');
    const [duration, setDuration] = useState(course.duration || '');

    // Format date for datetime-local input
    const formatDateTimeLocal = (isoString?: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().slice(0, 16);
    };

    const [startDate, setStartDate] = useState(formatDateTimeLocal(course.start_date));

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload: any = {
                title,
                description,
                price: parseFloat(price) || 0,
                thumbnail_url: thumbnailUrl,
                type,
                status,
                duration
            };
            if (startDate) {
                payload.start_date = new Date(startDate).toISOString();
            }
            await api.put(`/courses/${course.id}`, payload);
            setSuccessMessage('Course updated successfully!');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update course');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            await api.delete(`/courses/${course.id}`);
            navigate('/dashboard');
        } catch (err: any) {
            alert('Failed to delete course');
            setDeleting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const form = new FormData();
        form.append('image', file);

        try {
            const res = await api.post('/upload/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setThumbnailUrl(res.data.file_url);
        } catch (err) {
            alert('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Course Settings</h3>

            {error && <div style={{ padding: '1rem', background: 'rgba(243, 139, 168, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
            {successMessage && <div style={{ padding: '1rem', background: 'rgba(166, 227, 161, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '1.5rem' }}>{successMessage}</div>}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Course Title</label>
                    <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description (Markdown support)</label>
                    <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={6} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price ($)</label>
                        <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
                        <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                            <option value="paid">Paid</option>
                            <option value="free">Free</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                        <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="coming soon">Coming Soon</option>
                            <option value="not started">Not Started</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Duration (e.g. "4 Weeks")</label>
                        <input type="text" className="form-input" value={duration} onChange={e => setDuration(e.target.value)} placeholder="10 Hours" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Start Date</label>
                        <input type="datetime-local" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Thumbnail Image ({thumbnailUrl ? 'Found' : 'Missing'})</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="form-input" />
                        </div>
                        {thumbnailUrl && (
                            <img src={thumbnailUrl} alt="Thumbnail preview" style={{ height: '50px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                        )}
                    </div>
                    {uploadingImage && <small style={{ color: 'var(--brand-primary)' }}>Uploading image...</small>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving || uploadingImage} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--danger)' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Danger Zone</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Once you delete a course, there is no going back. Please be certain.</p>
                <button onClick={handleDelete} disabled={deleting} className="btn" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrashIcon style={{ width: '1.2rem' }} />
                    {deleting ? 'Deleting...' : 'Delete Course'}
                </button>
            </div>
        </div>
    );
}

function CourseReviews({ courseId }: { courseId: string }) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/reviews`);
            setReviews(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/courses/${courseId}/reviews`, { rating, comment });
            setComment('');
            setRating(5);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>;

    const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Student Reviews</h3>
                {reviews.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1.5rem' }}>★</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({reviews.length} reviews)</span>
                    </div>
                )}
            </div>

            {user && (
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Write a Review</h4>
                    <form onSubmit={submitReview}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Rating (1-5)</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-input" style={{ width: '120px' }}>
                                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Comment</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required className="form-input" rows={3} placeholder="What did you think about this course?"></textarea>
                        </div>
                        <button type="submit" disabled={submitting || !comment.trim()} className="btn btn-primary">{submitting ? 'Submitting...' : 'Submit Review'}</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p> :
                    reviews.map(r => (
                        <div key={r.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {r.avatar_url ? <img src={r.avatar_url} alt={r.user_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon style={{ width: '20px', color: 'var(--text-muted)' }} />}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{r.user_name || 'Anonymous User'}</h4>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>{r.comment}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [liking, setLiking] = useState(false);
    const [completingId, setCompletingId] = useState<string | null>(null);

    // UI state
    const [isCreatingModule, setIsCreatingModule] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings'>('overview');
    const [playingModuleUrl, setPlayingModuleUrl] = useState<string | null>(null);

    const { user } = useAuthStore();

    // Dnd-kit sensors settings
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const fetchCourseData = async () => {
        try {
            const courseRes = await api.get(`/courses/${id}`);
            setCourse(courseRes.data);

            // initialize local modules state sorted by order_index
            const sortedModules = [...(courseRes.data.modules || [])].sort((a, b) => a.order_index - b.order_index);
            setModules(sortedModules);

            if (user && user.id !== courseRes.data.teacher_id) {
                const enrollRes = await api.get(`/courses/${id}/enrollment`);
                setEnrollment(enrollRes.data);
            }
        } catch (err) {
            console.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCourseData();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) return;
        setEnrolling(true);
        try {
            await api.post(`/courses/${id}/enroll`);
            fetchCourseData();
        } catch (err) {
            alert('Failed to enroll. Please try again.');
        } finally {
            setEnrolling(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!user || liking || !course) return;
        setLiking(true);
        try {
            if (course.is_liked) {
                await api.delete(`/courses/${id}/like`);
                setCourse({ ...course, is_liked: false, likes_count: Math.max(0, course.likes_count - 1) });
            } else {
                await api.post(`/courses/${id}/like`);
                setCourse({ ...course, is_liked: true, likes_count: course.likes_count + 1 });
            }
        } catch (err) {
            console.error("Failed to toggle like", err);
        } finally {
            setLiking(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = modules.findIndex(m => m.id === active.id);
        const newIndex = modules.findIndex(m => m.id === over.id);

        const newOrder = arrayMove(modules, oldIndex, newIndex);
        setModules(newOrder); // Optimistic UI update

        try {
            const moduleIds = newOrder.map(m => m.id);
            await api.put(`/courses/${id}/modules/reorder`, { module_ids: moduleIds });
        } catch (err) {
            console.error("Failed to persist module reorder", err);
            // Revert on failure
            setModules(modules);
        }
    };

    const requestCertificate = async () => {
        try {
            const res = await api.post('/certificates/generate', { user_id: user?.id, course_id: course?.id });
            window.open(res.data.file_url, '_blank');
        } catch (err) {
            alert("Error generating certificate");
        }
    };

    const markModuleCompleted = async (moduleId: string) => {
        if (!user || user.id === course?.teacher_id) return;
        setCompletingId(moduleId);
        try {
            await api.post(`/courses/${id}/modules/${moduleId}/complete`);
            // Optimistically update
            setModules(prev => prev.map(m => m.id === moduleId ? { ...m, is_completed: true } : m));
            setPlayingModuleUrl(null);
            fetchCourseData(); // Refresh overall %
        } catch (err) {
            console.error("Failed to mark module as completed");
        } finally {
            setCompletingId(null);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>Loading course content...</div>;
    if (!course) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>Course not found</div>;

    const isTeacher = user?.id === course.teacher_id;
    const isEnrolled = enrollment?.enrolled;
    const canWatch = isTeacher || isEnrolled || user?.role === 'admin';

    // Compute Sequential Access
    let previousVideoCompleted = true; // First video is always unlocked inherently
    // Find the index of the first uncompleted video module to mark as "current"
    const currentModuleId = modules.find(m => m.type === 'video' && !m.is_completed)?.id || null;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                background: `linear-gradient(to right, var(--bg-primary) 20%, transparent), url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200'}) center/cover`,
                padding: '4rem 2rem',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
            }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>
                        <AcademicCapIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ESDC Masterclass</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>By {course.teacher_name}</p>

                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UserIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                            <span>{course.student_count} Enrolled</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <DocumentTextIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                            <span>{modules.length} Items</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HeartSolidIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--danger)' }} />
                            <span>{course.likes_count} Likes</span>
                        </div>
                        {course.duration && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ClockIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--brand-primary)' }} />
                                <span>{course.duration}</span>
                            </div>
                        )}
                        {course.start_date && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.8rem', borderRadius: '4px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Starts: {new Date(course.start_date).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

                {/* Left Column - Content */}
                <div className="course-content-col">
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '2px' }}>
                        {(isTeacher ? ['overview', 'curriculum', 'assignments', 'instructor', 'reviews', 'settings'] as const : ['overview', 'curriculum', 'assignments', 'instructor', 'reviews'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--brand-primary)' : '2px solid transparent',
                                    color: activeTab === tab ? (tab === 'settings' ? 'var(--warning)' : 'var(--brand-primary)') : 'var(--text-secondary)',
                                    fontWeight: activeTab === tab ? 600 : 500,
                                    fontSize: '1.05rem',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab === 'settings' && <Cog6ToothIcon style={{ width: '1.1rem' }} />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>

                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>About This Course</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                    {course.description || "No description provided."}
                                </p>
                            </div>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="animate-fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Course Curriculum</h3>
                                    {isTeacher && (
                                        <button onClick={() => setIsCreatingModule(!isCreatingModule)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            {isCreatingModule ? 'Cancel' : '+ Add Item'}
                                        </button>
                                    )}
                                </div>

                                {/* Progress summary for enrolled students */}
                                {!isTeacher && isEnrolled && modules.length > 0 && (() => {
                                    const videoModules = modules.filter(m => m.type === 'video');
                                    const completedCount = videoModules.filter(m => m.is_completed).length;
                                    const totalCount = videoModules.length;
                                    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                                    return (
                                        <div style={{
                                            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                            borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem',
                                            display: 'flex', alignItems: 'center', gap: '1.25rem',
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                        {completedCount} of {totalCount} modules completed
                                                    </span>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--brand-primary)' }}>
                                                        {pct}%
                                                    </span>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--success)' : 'var(--brand-primary)', transition: 'width 0.5s ease', borderRadius: '3px' }}></div>
                                                </div>
                                            </div>
                                            {pct === 100 && (
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', background: 'rgba(166, 227, 161, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                                                    🎉 All Done!
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}

                                {modules.length === 0 && !isCreatingModule ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                        <DocumentTextIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                                        <p className="text-secondary">No content published yet.</p>
                                    </div>
                                ) : (
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {modules.map((m, idx) => {
                                                    // Sequential locking logic: only lock videos, chapters are always unlocked.
                                                    // Teachers/Admins bypass locks.
                                                    // Also bypass lock if module is marked as Free Preview!
                                                    const isLocked = !isTeacher && m.type === 'video' && !m.is_free && !previousVideoCompleted;

                                                    // compute watch permission
                                                    const canWatchModule = canWatch || m.is_free;

                                                    // Only videos dictate progression. If it's a video, update the chained completed flag
                                                    if (m.type === 'video') {
                                                        previousVideoCompleted = m.is_completed;
                                                    }

                                                    return (
                                                        <SortableModuleItem
                                                            key={m.id}
                                                            module={m}
                                                            idx={idx}
                                                            isTeacher={isTeacher}
                                                            canWatch={canWatchModule}
                                                            isLocked={isLocked}
                                                            isCurrentModule={m.id === currentModuleId}
                                                            playingModuleUrl={playingModuleUrl}
                                                            setPlayingModuleUrl={setPlayingModuleUrl}
                                                            markCompleted={markModuleCompleted}
                                                            completingId={completingId}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}

                                {isCreatingModule && (
                                    <InlineModuleEditor
                                        courseId={course.id}
                                        modules={modules}
                                        onCancel={() => setIsCreatingModule(false)}
                                        onSuccess={() => {
                                            setIsCreatingModule(false);
                                            fetchCourseData();
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div className="animate-fade-in">
                                <AssignmentList courseId={course.id} isTeacher={isTeacher} isEnrolled={!!isEnrolled} />
                            </div>
                        )}

                        {activeTab === 'instructor' && (
                            <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
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
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-fade-in">
                                <CourseReviews courseId={course.id} />
                            </div>
                        )}

                        {activeTab === 'settings' && isTeacher && (
                            <CourseSettingsForm course={course} onSuccess={fetchCourseData} />
                        )}

                    </div>
                </div>

                {/* Right Column - Action Card */}
                <div className="course-action-col" style={{ position: 'sticky', top: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden', position: 'relative' }}>
                        {course.thumbnail_url && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', backgroundImage: `url(${course.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
                        )}

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                {(isEnrolled || isTeacher) ? (
                                    <>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>
                                            {isTeacher ? 'You are the Instructor' : 'You are Enrolled!'}
                                        </h2>
                                        {!isTeacher && (
                                            <>
                                                <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                                                    {course.progress ? course.progress.toFixed(0) : (enrollment?.progress_percentage || 0).toFixed(0)}% Complete
                                                </p>
                                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                                    <div style={{ width: `${course.progress !== undefined ? course.progress : enrollment?.progress_percentage || 0}%`, height: '100%', background: 'var(--success)', transition: 'width 0.3s ease' }}></div>
                                                </div>
                                            </>
                                        )}
                                        <p style={{ color: 'var(--brand-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                            <CheckCircleIcon style={{ width: '1.2rem' }} /> Full Access Unlocked
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </h2>
                                        <p style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                            <CheckCircleIcon style={{ width: '1.2rem' }} /> Lifetime Access Guarantee
                                        </p>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {user ? (
                                    <>
                                        {isTeacher ? (
                                            <button onClick={() => setActiveTab('settings')} className="btn btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>Manage Course</button>
                                        ) : isEnrolled ? (
                                            <>
                                                <button onClick={() => setActiveTab('curriculum')} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Continue Learning</button>
                                                {enrollment?.status === 'completed' && (
                                                    <button onClick={requestCertificate} className="btn btn-secondary" style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--success)', color: 'var(--success)' }}>Download Certificate</button>
                                                )}
                                            </>
                                        ) : (
                                            <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                                {enrolling ? 'Processing...' : 'Enroll Now'}
                                            </button>
                                        )}
                                        <Link to={`/chat?course=${course.id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', padding: '1rem' }}>Community Chat</Link>
                                        <button
                                            onClick={handleLikeToggle}
                                            disabled={liking}
                                            className="btn"
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: course.is_liked ? 'rgba(243, 139, 168, 0.1)' : 'transparent',
                                                border: course.is_liked ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                                                color: course.is_liked ? 'var(--danger)' : 'var(--text-secondary)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {course.is_liked ? <HeartSolidIcon style={{ width: '1.2rem' }} /> : <HeartIcon style={{ width: '1.2rem' }} />}
                                            {course.is_liked ? 'Liked' : 'Like'} ({course.likes_count})
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '1rem', fontSize: '1.1rem' }}>Login to Enroll</Link>
                                )}
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <ClockIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                                    <span>Learn at your own pace</span>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <DocumentTextIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                                    <span>{modules.filter(m => m.type === 'video').length} comprehensive videos</span>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <AcademicCapIcon style={{ width: '1.5rem', color: 'var(--brand-primary)' }} />
                                    <span>Verifiable digital certificate</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
