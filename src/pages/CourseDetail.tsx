import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import CreateModuleModal from '../components/CreateModuleModal';
import { PlayCircleIcon, AcademicCapIcon, UserIcon, ClockIcon, DocumentTextIcon, CheckCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Module {
    id: string;
    title: string;
    video_url: string;
    order_index: number;
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
}

interface Enrollment {
    enrolled: boolean;
    status: string;
    progress_percentage: number;
}

// Sub-component for individual Draggable Module Items
function SortableModuleItem({ module, idx, playingModuleUrl, setPlayingModuleUrl, canWatch, isTeacher }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: isDragging ? 'relative' : 'static',
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div ref={setNodeRef} style={style as React.CSSProperties}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isTeacher && (
                        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                            <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                    )}
                    <div style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {idx + 1}
                    </div>
                    <h4 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{module.title}</h4>
                </div>

                {canWatch ? (
                    <button
                        onPointerDown={(e) => e.stopPropagation()} // Prevent DnD from hijacking button clicks if it bubbles
                        onClick={() => setPlayingModuleUrl(playingModuleUrl === module.video_url ? null : module.video_url)}
                        className="btn"
                        style={{ background: 'transparent', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', padding: '0.5rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <PlayCircleIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        {playingModuleUrl === module.video_url ? 'Close' : 'Play'}
                    </button>
                ) : (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Locked</span>
                )}
            </div>

            {playingModuleUrl === module.video_url && canWatch && (
                <div style={{ background: '#000', width: '100%', aspectRatio: '16/9' }} onPointerDown={(e) => e.stopPropagation()}>
                    <video
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%' }}
                        src={module.video_url}
                    >
                        Your browser does not support HTML video.
                    </video>
                </div>
            )}
        </div>
    );
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    // UI state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor'>('overview');
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>Loading course content...</div>;
    if (!course) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>Course not found</div>;

    const isTeacher = user?.id === course.teacher_id;
    const isEnrolled = enrollment?.enrolled;
    const canWatch = isTeacher || isEnrolled || user?.role === 'admin';

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                background: `linear-gradient(to right, var(--bg-primary) 20%, transparent), url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200'}) center/cover`,
                padding: '4rem 3rem',
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
                            <span>{modules.length} Modules</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

                {/* Left Column - Content */}
                <div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                        {(['overview', 'curriculum', 'instructor'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--brand-primary)' : '2px solid transparent',
                                    color: activeTab === tab ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                    fontWeight: activeTab === tab ? 600 : 500,
                                    fontSize: '1.05rem',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s'
                                }}
                            >
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
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Course Modules</h3>
                                    {isTeacher && (
                                        <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>+ Add Module</button>
                                    )}
                                </div>

                                {modules.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                        <DocumentTextIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                                        <p className="text-secondary">No modules published yet.</p>
                                    </div>
                                ) : (
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {modules.map((m, idx) => (
                                                    <SortableModuleItem
                                                        key={m.id}
                                                        module={m}
                                                        idx={idx}
                                                        isTeacher={isTeacher}
                                                        canWatch={canWatch}
                                                        playingModuleUrl={playingModuleUrl}
                                                        setPlayingModuleUrl={setPlayingModuleUrl}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}
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

                    </div>
                </div>

                {/* Right Column - Action Card */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden', position: 'relative' }}>
                        {course.thumbnail_url && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', backgroundImage: `url(${course.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
                        )}

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                </h2>
                                <p style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                    <CheckCircleIcon style={{ width: '1.2rem' }} /> Lifetime Access Guarantee
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {user ? (
                                    <>
                                        {isTeacher ? (
                                            <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled>You are the Instructor</button>
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
                                    <span>{modules.length} comprehensive modules</span>
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

            {isModalOpen && (
                <div style={{ position: 'fixed', zIndex: 9999 }}>
                    <CreateModuleModal
                        courseId={course.id}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            fetchCourseData();
                        }}
                    />
                </div>
            )}
        </div>
    );
}
