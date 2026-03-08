import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { FiLoader } from 'react-icons/fi';
import AssignmentList from '../components/AssignmentList';
import CourseSettingsForm from '../components/CourseSettingsForm';
import CourseReviews from '../components/CourseReviews';
import CourseHero from '../components/CourseHero';
import CourseTabs from '../components/CourseTabs';
import CourseOverviewTab from '../components/CourseOverviewTab';
import CourseCurriculumTab from '../components/CourseCurriculumTab';
import CourseInstructorTab from '../components/CourseInstructorTab';
import CourseActionCard from '../components/CourseActionCard';
import { Course } from '../types/course';
import { Module } from '../types/module';
import type { CourseDTO } from '../types/course';
import type { ModuleDTO } from '../types/module';

interface Enrollment {
    enrolled: boolean;
    progress_percentage?: number;
}

// Hook for fetching course data
function useCourseData(courseId: string | undefined) {
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourseData = useCallback(async () => {
        if (!courseId) return;
        try {
            const courseRes = await api.get(`/courses/${courseId}`);
            const courseData = Course.fromDTO(courseRes.data as CourseDTO);
            setCourse(courseData);
            const sortedModules = [...courseData.modules].sort((a, b) => a.orderIndex - b.orderIndex);
            setModules(sortedModules);
        } catch {
            console.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseData();
    }, [courseId, fetchCourseData]);

    return { course, modules, setModules, loading, setCourse, fetchCourseData };
}

// Hook for enrollment management
function useEnrollment(courseId: string | undefined, course: Course | null) {
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!courseId || !user || !course || user.id === course.teacherId) return;

        const fetchEnrollment = async () => {
            try {
                const enrollRes = await api.get(`/courses/${courseId}/enrollment`);
                setEnrollment(enrollRes.data as Enrollment);
            } catch (err) {
                console.error("Failed to load enrollment data", err);
            }
        };

        fetchEnrollment();
    }, [courseId, user, course]);

    const handleEnroll = useCallback(async (courseId: string, onSuccess: () => void) => {
        if (!user) return;
        setEnrolling(true);
        try {
            await api.post(`/courses/${courseId}/enroll`);
            onSuccess();
        } catch (err) {
            console.error("Failed to enroll", err);
            alert('Failed to enroll. Please try again.');
        } finally {
            setEnrolling(false);
        }
    }, [user]);

    return { enrollment, enrolling, handleEnroll };
}

// Hook for course likes
function useCourseLikes(courseId: string | undefined, course: Course | null, setCourse: (course: Course | null) => void) {
    const [liking, setLiking] = useState(false);

    const handleLikeToggle = useCallback(async () => {
        if (!courseId || liking || !course) return;
        setLiking(true);
        try {
            if (course.isLiked) {
                await api.delete(`/courses/${courseId}/like`);
                setCourse(Course.fromDTO({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    thumbnail_url: course.thumbnailUrl,
                    teacher_id: course.teacherId,
                    teacher_name: course.teacherName,
                    teacher_avatar_url: course.teacherAvatarUrl,
                    teacher_bio: course.teacherBio,
                    student_count: course.studentCount,
                    modules: course.modules.map(m => ({
                        id: m.id,
                        parent_id: m.parentId,
                        title: m.title,
                        description: m.description,
                        type: m.type,
                        video_url: m.videoUrl,
                        points: m.points,
                        is_free: m.isFree,
                        order_index: m.orderIndex,
                        is_completed: m.isCompleted,
                    })),
                    type: course.type,
                    status: course.status,
                    duration: course.duration,
                    is_certificate_available: course.certificateAvailable,
                    start_date: course.startDate,
                    progress: course.progress,
                    likes_count: Math.max(0, course.likesCount - 1),
                    is_liked: false,
                } as CourseDTO));
            } else {
                await api.post(`/courses/${courseId}/like`);
                setCourse(Course.fromDTO({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    thumbnail_url: course.thumbnailUrl,
                    teacher_id: course.teacherId,
                    teacher_name: course.teacherName,
                    teacher_avatar_url: course.teacherAvatarUrl,
                    teacher_bio: course.teacherBio,
                    student_count: course.studentCount,
                    modules: course.modules.map(m => ({
                        id: m.id,
                        parent_id: m.parentId,
                        title: m.title,
                        description: m.description,
                        type: m.type,
                        video_url: m.videoUrl,
                        points: m.points,
                        is_free: m.isFree,
                        order_index: m.orderIndex,
                        is_completed: m.isCompleted,
                    })),
                    type: course.type,
                    status: course.status,
                    duration: course.duration,
                    is_certificate_available: course.certificateAvailable,
                    start_date: course.startDate,
                    progress: course.progress,
                    likes_count: course.likesCount + 1,
                    is_liked: true,
                } as CourseDTO));
            }
        } catch (err) {
            console.error("Failed to toggle like", err);
        } finally {
            setLiking(false);
        }
    }, [courseId, liking, course, setCourse]);

    return { liking, handleLikeToggle };
}

// Hook for module operations
function useModuleOperations(courseId: string | undefined, course: Course | null, setModules: (modules: Module[] | ((prev: Module[]) => Module[])) => void, onModuleChange: () => void) {
    const [completingId, setCompletingId] = useState<string | null>(null);
    const { user } = useAuthStore();

    const markModuleCompleted = useCallback(async (moduleId: string) => {
        if (!courseId || !user || user.id === course?.teacherId) return;
        setCompletingId(moduleId);
        try {
            await api.post(`/courses/${courseId}/modules/${moduleId}/complete`);
            setModules(prev => prev.map(m => {
                if (m.id === moduleId) {
                    const dto: ModuleDTO = {
                        id: m.id,
                        parent_id: m.parentId,
                        title: m.title,
                        description: m.description,
                        type: m.type,
                        video_url: m.videoUrl,
                        points: m.points,
                        is_free: m.isFree,
                        order_index: m.orderIndex,
                        is_completed: true,
                    };
                    return Module.fromDTO(dto);
                }
                return m;
            }));
            onModuleChange();
        } catch (err) {
            console.error("Failed to mark module as completed", err);
        } finally {
            setCompletingId(null);
        }
    }, [courseId, user, course?.teacherId, setModules, onModuleChange]);

    const handleDeleteModule = useCallback(async (moduleId: string) => {
        if (!courseId) return;
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await api.delete(`/courses/${courseId}/modules/${moduleId}`);
            onModuleChange();
        } catch (err) {
            console.error("Failed to delete module", err);
            alert("Failed to delete module. Please try again.");
        }
    }, [courseId, onModuleChange]);

    return { completingId, markModuleCompleted, handleDeleteModule };
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    
    // UI state
    const [isCreatingModule, setIsCreatingModule] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings'>('overview');
    const [playingModuleUrl, setPlayingModuleUrl] = useState<string | null>(null);

    const { user } = useAuthStore();

    // Custom hooks for separated concerns
    const { course, modules, setModules, loading, setCourse, fetchCourseData } = useCourseData(id);
    const { enrollment, enrolling, handleEnroll } = useEnrollment(id, course);
    const { liking, handleLikeToggle } = useCourseLikes(id, course, setCourse);
    const { completingId, markModuleCompleted, handleDeleteModule } = useModuleOperations(id, course, setModules, fetchCourseData);

    const handleEnrollClick = useCallback(async () => {
        await handleEnroll(id!, fetchCourseData);
    }, [handleEnroll, id, fetchCourseData]);

    const requestCertificate = useCallback(async () => {
        if (!user || !course) return;
        try {
            const res = await api.post('/certificates/generate', { user_id: user.id, course_id: course.id });
            const fileName = res.data.file_url.split('/').pop();
            const downloadUrl = `${import.meta.env.VITE_API_URL}/certificates/download?file=${fileName}&name=${encodeURIComponent(course.title || 'Certificate')}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error generating certificate", err);
            alert("Error generating certificate");
        }
    }, [user, course]);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
            <FiLoader size={48} className="animate-pulse" style={{ color: 'var(--brand-primary)' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading course content...</p>
        </div>
    );
    if (!course) return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <p style={{ color: 'var(--danger)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Course not found</p>
            <p style={{ color: 'var(--text-secondary)' }}>The course you're looking for doesn't exist or has been removed.</p>
        </div>
    );

    const isTeacher = user?.id === course.teacherId;
    const isEnrolled = enrollment?.enrolled;
    const canWatch = isTeacher || isEnrolled || user?.role === 'admin';

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero Section */}
            <CourseHero course={course} modulesCount={modules.length} />

            {/* Layout Grid */}
            <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

                {/* Left Column - Content */}
                <div className="course-content-col" style={{ minWidth: 0 }}>
                    {/* Tabs */}
                    <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} isTeacher={isTeacher} />

                    {/* Tab Contents */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', minHeight: '400px' }}>

                        <CourseOverviewTab course={course} isCompleted={enrollment?.progress_percentage === 100} />

                        {activeTab === 'curriculum' && (
                            <CourseCurriculumTab
                                course={course}
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
                    handleEnroll={handleEnrollClick}
                    handleLikeToggle={handleLikeToggle}
                    requestCertificate={requestCertificate}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}
