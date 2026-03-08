/**
 * User Filtering & Sorting Utilities
 * Single Responsibility: Each function handles one specific task
 */
import type { User } from '../types/user';
import type { FilterRole, SortOption } from '../types/userFilters';

/**
 * Filter users by role
 */
export function filterUsersByRole(users: User[], role: FilterRole): User[] {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
}

/**
 * Sort users based on sort option
 */
export function sortUsers(users: User[], sortBy: SortOption): User[] {
    const sorted = [...users];
    // Assuming most recent users are appended last
    if (sortBy === 'recent') {
        return sorted.reverse();
    }
    return sorted;
}

/**
 * Combine all filters and sorting
 */
export function applyUserFilters(
    users: User[],
    role: FilterRole,
    sortBy: SortOption
): User[] {
    let filtered = filterUsersByRole(users, role);
    filtered = sortUsers(filtered, sortBy);
    return filtered;
}
