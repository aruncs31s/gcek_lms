/**
 * LeaderboardList Component - Displays paginated leaderboard rows
 * Single Responsibility: Manages list display and pagination
 */
import Pagination from './Pagination';
import LeaderboardRow from './LeaderboardRow';
import type { User } from '../types/user';

interface LeaderboardListProps {
    users: User[];
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function LeaderboardList({
    users,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange
}: LeaderboardListProps) {
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(users.length / pageSize);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div
                className="leaderboard-container"
                style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                }}
            >
                {paginatedUsers.map((user, index) => {
                    const globalIndex = (currentPage - 1) * pageSize + index;
                    return (
                        <LeaderboardRow 
                            key={user.id} 
                            user={user} 
                            globalIndex={globalIndex} 
                        />
                    );
                })}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
}
