import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import AssignmentList from '../components/AssignmentList';
import CourseSettingsForm from '../components/CourseSettingsForm';
import CourseReviews from '../components/CourseReviews';
import CourseHero from '../components/CourseHero';
import CourseTabs from '../components/CourseTabs';
import CourseOverviewTab from '../components/CourseOverviewTab';
import CourseCurriculumTab from '../components/CourseCurriculumTab';
import CourseInstructorTab from '../components/CourseInstructorTab';
import CourseActionCard from '../components/CourseActionCard';
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

    const requestCertificate = async () => {
        try {
            const res = await api.post('/certificates/generate', { user_id: user?.id, course_id: course?.id });
            window.open(res.data.file_url, '_blank');
        } catch (err) {
            alert("Error generating certificate");
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

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <CourseHero course={course} modulesCount={modules.length} />

            {/* Layout Grid */}
            <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

                {/* Left Column - Content */}
                <div className="course-content-col">
                    {/* Tabs */}
                    <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} isTeacher={isTeacher} />

                    {/* Tab Contents */}
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>

                        {activeTab === 'overview' && (
                            <CourseOverviewTab course={course} isCompleted={enrollment?.status === 'completed'} />
                        )}

                        {activeTab === 'curriculum' && (
                            <CourseCurriculumTab
                                courseId={course.id}
                                modules={modules}
                                setModules={setModules}
                                isTeacher={isTeacher}
                                isEnrolled={!!isEnrolled}
                                canWatch={canWatch}
                                isCreatingModule={isCreatingModule}
                                setIsCreatingModule={setIsCreatingModule}
                                editingModuleId={editingModuleId}
                                setEditingModuleId={setEditingModuleId}
                                playingModuleUrl={playingModuleUrl}
                                setPlayingModuleUrl={setPlayingModuleUrl}
                                completingId={completingId}
                                markModuleCompleted={markModuleCompleted}
                                handleDeleteModule={handleDeleteModule}
                                fetchCourseData={fetchCourseData}
                            />
                        )}

                        {activeTab === 'assignments' && (
                            <div className="animate-fade-in">
                                <AssignmentList courseId={course.id} isTeacher={isTeacher} isEnrolled={!!isEnrolled} />
                            </div>
                        )}

                        {activeTab === 'instructor' && (
                            <CourseInstructorTab course={course} />
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
                <CourseActionCard
                    course={course}
                    user={user}
                    isTeacher={isTeacher}
                    isEnrolled={!!isEnrolled}
                    enrollment={enrollment}
                    enrolling={enrolling}
                    liking={liking}
                    modules={modules}
                    handleEnroll={handleEnroll}
                    handleLikeToggle={handleLikeToggle}
                    requestCertificate={requestCertificate}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}
