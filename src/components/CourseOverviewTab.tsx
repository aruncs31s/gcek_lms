import type { Course } from '../types/course';
import CertificateGenerator from './CertificateGenerator';

interface CourseOverviewTabProps {
    course: Course;
    isCompleted?: boolean;
}

export default function CourseOverviewTab({ course, isCompleted }: CourseOverviewTabProps) {
    return (
        <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>About This Course</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                {course.description || "No description provided."}
            </p>

            {isCompleted && (
                <CertificateGenerator courseId={course.id} courseName={course.title} />
            )}
        </div>
    );
}
