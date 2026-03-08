/**
 * UsersGrid Component - Renders paginated users grid
 * Single Responsibility: Only manages grid display and pagination
 */
import Pagination from './Pagination';
import UserCard from './UserCard';
import type { User } from '../types/user';

interface UsersGridProps {
    users: User[];
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function UsersGrid({
    users,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange
}: UsersGridProps) {
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(users.length / pageSize);

    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1.5rem'
                }}
            >
                {paginatedUsers.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
            />
        </>
    );
}
