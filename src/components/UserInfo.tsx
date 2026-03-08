/**
 * UserInfo Component - Displays user name and enrollment info
 * Single Responsibility: Only displays user information
 */
interface UserInfoProps {
    firstName: string;
    lastName: string;
    enrolledCourses: number;
}

export default function UserInfo({ firstName, lastName, enrolledCourses }: UserInfoProps) {
    return (
        <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>
                {firstName} {lastName}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                {enrolledCourses} Course{enrolledCourses !== 1 ? 's' : ''} Enrolled
            </p>
        </div>
    );
}
