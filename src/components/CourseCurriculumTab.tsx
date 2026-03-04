import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableModuleItem from './SortableModuleItem';
import InlineModuleEditor from './InlineModuleEditor';
import type { Module } from '../types/course';

interface CourseCurriculumTabProps {
    courseId: string;
    modules: Module[];
    setModules: (modules: Module[]) => void;
    isTeacher: boolean;
    isEnrolled: boolean;
    canWatch: boolean;
    isCreatingModule: boolean;
    setIsCreatingModule: (value: boolean) => void;
    editingModuleId: string | null;
    setEditingModuleId: (id: string | null) => void;
    playingModuleUrl: string | null;
    setPlayingModuleUrl: (url: string | null) => void;
    completingId: string | null;
    markModuleCompleted: (moduleId: string) => void;
    handleDeleteModule: (moduleId: string) => void;
    fetchCourseData: () => void;
}

export default function CourseCurriculumTab({
    courseId,
    modules,
    setModules,
    isTeacher,
    isEnrolled,
    canWatch,
    isCreatingModule,
    setIsCreatingModule,
    editingModuleId,
    setEditingModuleId,
    playingModuleUrl,
    setPlayingModuleUrl,
    completingId,
    markModuleCompleted,
    handleDeleteModule,
    fetchCourseData
}: CourseCurriculumTabProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = modules.findIndex(m => m.id === active.id);
        const newIndex = modules.findIndex(m => m.id === over.id);

        const newOrder = arrayMove(modules, oldIndex, newIndex);
        setModules(newOrder);

        try {
            const { api } = await import('../lib/api');
            const moduleIds = newOrder.map(m => m.id);
            await api.put(`/courses/${courseId}/modules/reorder`, { module_ids: moduleIds });
        } catch (err) {
            console.error("Failed to persist module reorder", err);
            setModules(modules);
        }
    };

    const videoModules = modules.filter(m => m.type === 'video');
    const completedCount = videoModules.filter(m => m.is_completed).length;
    const totalCount = videoModules.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let previousVideoCompleted = true;
    const currentModuleId = modules.find(m => m.type === 'video' && !m.is_completed)?.id || null;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Course Curriculum</h3>
                {isTeacher && (
                    <button onClick={() => setIsCreatingModule(!isCreatingModule)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        {isCreatingModule ? 'Cancel' : '+ Add Item'}
                    </button>
                )}
            </div>

            {!isTeacher && isEnrolled && modules.length > 0 && (
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
            )}

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
                                const isLocked = !isTeacher && m.type === 'video' && !m.is_free && !previousVideoCompleted;
                                const canWatchModule = canWatch || m.is_free;

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
                                        onEdit={() => setEditingModuleId(m.id)}
                                        onDelete={handleDeleteModule}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {isCreatingModule && (
                <InlineModuleEditor
                    courseId={courseId}
                    modules={modules}
                    onCancel={() => setIsCreatingModule(false)}
                    onSuccess={() => {
                        setIsCreatingModule(false);
                        fetchCourseData();
                    }}
                />
            )}

            {editingModuleId && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Edit Module</h3>
                        <InlineModuleEditor
                            courseId={courseId}
                            modules={modules}
                            editModule={modules.find(m => m.id === editingModuleId)}
                            onCancel={() => setEditingModuleId(null)}
                            onSuccess={() => {
                                setEditingModuleId(null);
                                fetchCourseData();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
