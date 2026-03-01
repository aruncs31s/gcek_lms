import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PlayCircleIcon, CheckCircleIcon, Bars3Icon, LockClosedIcon, CheckBadgeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Module } from '../types/course';

interface SortableModuleItemProps {
    module: Module;
    idx: number;
    playingModuleUrl: string | null;
    setPlayingModuleUrl: (url: string | null) => void;
    canWatch: boolean;
    isTeacher: boolean;
    isLocked: boolean;
    isCurrentModule: boolean;
    markCompleted: (moduleId: string) => void;
    completingId: string | null;
    onEdit: (module: Module) => void;
    onDelete: (moduleId: string) => void;
}

export default function SortableModuleItem({ module, idx, playingModuleUrl, setPlayingModuleUrl, canWatch, isTeacher, isLocked, isCurrentModule, markCompleted, completingId, onEdit, onDelete }: SortableModuleItemProps) {
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

                {isTeacher && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onEdit(module)}
                            className="btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--brand-primary)',
                                color: 'var(--brand-primary)',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '6px'
                            }}
                            title="Edit Module"
                        >
                            <PencilSquareIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onDelete(module.id)}
                            className="btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--danger)',
                                color: 'var(--danger)',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '6px'
                            }}
                            title="Delete Module"
                        >
                            <TrashIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        </button>
                    </div>
                )}

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
