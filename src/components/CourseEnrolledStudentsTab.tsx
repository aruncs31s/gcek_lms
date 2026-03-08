import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { FiLoader, FiUsers, FiMail } from 'react-icons/fi';
import { User, type UserDTO } from '../types/user';



// interface EnrolledStudent {
//     id: string;
//     first_name?: string;
//     last_name?: string;
//     email: string;
//     avatar_url?: string;
//     role: string;
// }

interface CourseEnrolledStudentsTabProps {
    courseId: string;
}

export default function CourseEnrolledStudentsTab({ courseId }: CourseEnrolledStudentsTabProps) {
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, countRes] = await Promise.all([
                    api.get(`/courses/${courseId}/enrollments/users`),
                    api.get(`/courses/${courseId}/enrollments/users/count`)
                ]);
                const students = studentsRes.data.enrollments.map((dto: UserDTO) => User.fromDTO(dto));
                setStudents(students || []);
                setCount(countRes.data.count || 0);
            } catch (err) {
                console.error('Failed to fetch enrolled students', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <FiLoader size={32} className="animate-pulse" style={{ color: 'var(--brand-primary)' }} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <FiUsers size={24} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Enrolled Students ({count})
                </h2>
            </div>

            {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <FiUsers size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No students enrolled yet</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="glass-panel"
                            style={{
                                padding: '1.25rem',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: student.avatar
                                        ? `url(${student.avatar}) center/cover`
                                        : 'var(--brand-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                }}
                            >
                                {!student.avatar && `${student.firstName?.[0]}${student.lastName?.[0]}`}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                    {student.fullName}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <FiMail size={14} />
                                    {student.email}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
