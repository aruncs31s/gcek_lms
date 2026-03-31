import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Course } from '../models/course';
import { User } from '../models/user';
import ProfileOverviewCard from '../components/profile/ProfileOverviewCard';
import CreatedCoursesSection from '../components/profile/CreatedCoursesSection';
import EnrolledCoursesSection from '../components/profile/EnrolledCoursesSection';
import AchievementsSection from '../components/AchievementsSection';
import { type UserProfileData } from '../types/profile';
import { CourseRepository } from '../repositories/courseRepository';


export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const courseRepository = useMemo(() => new CourseRepository(), []);

    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const isOwnProfile = currentUser?.id === id;
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await courseRepository.getEnrolments(id!);
                setProfileData(res);
                if (res.user.role === 'teacher') {
                    const coursesRes = await courseRepository.getTeachersCourses(id!);
                    setCreatedCourses(coursesRes);
                }
            } catch (err) {
                console.error("Failed to load user profile", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading profile...</p>
            </div>
        );
    }

    if (!profileData || !profileData.user) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>User Not Found</h2>
                <button onClick={() => navigate('/users')} className="btn btn-secondary">Go Back to Members</button>
            </div>
        );
    }

    const { user, points, achievements, enrolments } = profileData;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent' }}>
                <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                Back
            </button>

            {/* Profile Overview Card */}
            <ProfileOverviewCard user={User.fromDTO(user)} points={points} isOwnProfile={isOwnProfile} />

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>

                {/* Created Courses Section (Teachers Only) */}
                {user.role === 'teacher' && (
                    <CreatedCoursesSection courses={createdCourses} />
                )}

                {/* Enrolments Section */}
                <EnrolledCoursesSection enrolments={enrolments} />

                {/* Achievements Section */}
                <AchievementsSection achievements={achievements} />
            </div>
        </div>
    );
}
