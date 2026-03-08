/**
 * useLeaderboard Hook - Manages leaderboard data fetching
 * Single Responsibility: Only handles data fetching and pagination
 */
import { useEffect, useState } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import type { User } from '../types/user';
import { DEFAULT_PAGE_CONFIG } from '../types/leaderboardRanking';

export function useLeaderboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_CONFIG.INITIAL_PAGE);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_CONFIG.PAGE_SIZE);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const leaderboardUsers = await leaderboardService.getLeaderboard();
                setUsers(leaderboardUsers);
            } catch (err) {
                console.error('Failed to load leaderboard:', err);
                setError('Failed to load leaderboard data');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return {
        users,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize
    };
}
