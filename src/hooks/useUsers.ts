/**
 * useUsers Hook - Manages user data fetching and filtering
 * Single Responsibility: Only handles data fetching and filtering logic
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/user';
import type { FilterRole, SortOption } from '../types/userFilters';
import { applyUserFilters } from '../utils/userFilters';

const DEBOUNCE_MS = 300;

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState<FilterRole>('all');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fetch and filter users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            let fetchedUsers: User[] = [];

            if (searchQuery.trim()) {
                // If search query exists, use search API
                fetchedUsers = await userService.searchUsers(searchQuery);
            } else {
                // Otherwise, fetch all users
                fetchedUsers = await userService.getUsers({
                    userType: filterRole === 'all' ? '' : filterRole,
                    limit: 100,
                    offset: 0
                });
            }

            // Apply additional filtering and sorting
            const filtered = applyUserFilters(fetchedUsers, filterRole, sortBy);
            setUsers(filtered);
        } catch (err) {
            console.error('Failed to load users:', err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filterRole, sortBy]);

    // Debounced fetch with cleanup
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchUsers();
        }, DEBOUNCE_MS);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [fetchUsers]);

    return {
        users,
        loading,
        filterRole,
        setFilterRole,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery
    };
}
