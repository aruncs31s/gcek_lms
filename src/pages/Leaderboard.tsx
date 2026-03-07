import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import Pagination from '../components/Pagination';
import LeaderboardRow from '../components/LeaderboardRow';

interface LeaderboardUser {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    points: number;
    enrolled_courses: number;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard');
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Global Leaderboard</h1>
                <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    See who's leading the pack. Complete courses and earn points to climb the ranks!
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading leaderboard...</div>
            ) : users.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '1.25rem' }}>No data available yet.</p>
                </div>
            ) : (
                <div className="leaderboard-container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {users.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user, index) => {
                        const globalIndex = (currentPage - 1) * pageSize + index;
                        return (
                            <LeaderboardRow key={user.user_id} user={user} globalIndex={globalIndex} />
                        )
                    })}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(users.length / pageSize)}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
