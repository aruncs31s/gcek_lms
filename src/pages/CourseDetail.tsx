import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { AcademicCapIcon, UserIcon, ClockIcon, DocumentTextIcon, CheckCircleIcon, Cog6ToothIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AssignmentList from '../components/AssignmentList';
import SortableModuleItem from '../components/SortableModuleItem';
import InlineModuleEditor from '../components/InlineModuleEditor';
import CourseSettingsForm from '../components/CourseSettingsForm';
import CourseReviews from '../components/CourseReviews';
import type { Module, Course, Enrollment } from '../types/course';

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
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
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

    const handleDeleteModule = async (moduleId: string) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await api.delete(`/courses/${id}/modules/${moduleId}`);
            fetchCourseData();
        } catch (err) {
            console.error("Failed to delete module");
            alert("Failed to delete module. Please try again.");
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
            <div className="course-detail-hero" style={{
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
                    <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>By {course.teacher_name}</p>

                    <div className="course-meta" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
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
                    <div className="course-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '2px' }}>
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
                                        courseId={course.id}
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
                                                courseId={course.id}
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
                        )}

                        {activeTab === 'assignments' && (
                            <div className="animate-fade-in">
                                <AssignmentList courseId={course.id} isTeacher={isTeacher} isEnrolled={!!isEnrolled} />
                            </div>
                        )}

                        {activeTab === 'instructor' && (
                            <div className="animate-fade-in instructor-section" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
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
