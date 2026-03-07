import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { UserIcon, ArrowLeftIcon, TrophyIcon, BookOpenIcon, CheckCircleIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import type { Course } from '../types/course';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    points: number;
    earned_at: string;
}

interface Enrolment {
    course_id: string;
    course_title: string;
    course_thumbnail_url: string;
    status: string;
    progress_percentage: number;
    enrolled_at: string;
}

interface UserProfileData {
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        avatar_url: string;
    };
    points: number;
    achievements: Achievement[];
    enrolments: Enrolment[];
    total_enrolments: number;
}

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
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
                const res = await api.get(`/users/${id}/enrolments`);
                setProfileData(res.data);
                if (res.data.user.role === 'teacher') {
                    const coursesRes = await api.get(`/courses?teacher_id=${id}`);
                    setCreatedCourses(coursesRes.data || []);
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

    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return { background: 'rgba(243, 139, 168, 0.15)', color: 'var(--danger)', border: '1px solid rgba(243, 139, 168, 0.3)' };
            case 'teacher':
                return { background: 'rgba(203, 166, 247, 0.15)', color: 'var(--brand-primary)', border: '1px solid rgba(203, 166, 247, 0.3)' };
            case 'student':
            default:
                return { background: 'rgba(166, 227, 161, 0.15)', color: 'var(--success)', border: '1px solid rgba(166, 227, 161, 0.3)' };
        }
    };

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
            <div className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.05) 0%, rgba(245, 194, 231, 0.05) 100%)', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '4px solid var(--bg-secondary)', boxShadow: '0 0 0 2px var(--brand-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)' }} />
                    )}
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    {user.first_name} {user.last_name}
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                    {user.email}
                </p>

                {isOwnProfile && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link to="/profile/edit" className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                            Edit Profile
                        </Link>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span className="badge" style={{ ...getRoleBadgeStyle(user.role), fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
                        {user.role}
                    </span>
                    <span className="badge badge-blur" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', padding: '0.35rem 1rem' }}>
                        <TrophyIcon style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }} />
                        {points} Points
                    </span>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>

                {/* Created Courses Section (Teachers Only) */}
                {user.role === 'teacher' && (
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <PresentationChartBarIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Courses Created ({createdCourses.length})</h2>
                        </div>

                        {createdCourses.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                                <p className="text-muted">No courses created yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {createdCourses.map(course => (
                                    <Link to={`/courses/${course.id}`} key={course.id} className="stat-box hover-card-effect" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column', textDecoration: 'none' }}>
                                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'var(--bg-tertiary)', border: '1px solid var(--border-color)', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                {course.status.toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{course.title}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <span>{course.student_count || 0} Students</span>
                                                <span style={{ fontWeight: '600', color: course.price === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Enrolments Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <BookOpenIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--brand-primary)' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Enrolled Courses</h2>
                    </div>

                    {(!enrolments || enrolments.length === 0) ? (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                            <p className="text-muted">No courses enrolled yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {enrolments.map(enrolment => (
                                <Link to={`/courses/${enrolment.course_id}`} key={enrolment.course_id} className="stat-box" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left', textDecoration: 'none' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: enrolment.course_thumbnail_url ? `url(${enrolment.course_thumbnail_url}) center/cover` : 'var(--bg-tertiary)', border: '1px solid var(--border-color)', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{enrolment.course_title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, background: 'var(--bg-tertiary)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(enrolment.progress_percentage || 0, 100)}%`, background: 'var(--brand-primary)', height: '100%' }} />
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{Math.round(enrolment.progress_percentage || 0)}%</span>
                                        </div>
                                    </div>
                                    {enrolment.status === 'completed' && <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--success)', flexShrink: 0 }} />}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Achievements Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <TrophyIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--warning)' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Achievements</h2>
                    </div>

                    {(!achievements || achievements.length === 0) ? (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                            <p className="text-muted">No achievements earned yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {achievements.map(achievement => (
                                <div key={achievement.id} className="stat-box" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249, 226, 175, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                                        {achievement.icon_url ? (
                                            <img src={achievement.icon_url} alt={achievement.title} style={{ width: '24px', height: '24px' }} />
                                        ) : (
                                            <TrophyIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{achievement.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600, margin: 0 }}>+{achievement.points} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
