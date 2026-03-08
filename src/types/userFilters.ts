/**
 * User Filtering & Sorting Types and Constants
 * Interface Segregation: Separate concerns for filtering and sorting
 */

export type FilterRole = 'all' | 'admin' | 'teacher' | 'student';
export type SortOption = 'recent' | 'oldest';

export interface UserFilterOptions {
    role: FilterRole;
    searchQuery: string;
    sortBy: SortOption;
}

export const FILTER_OPTIONS = {
    ROLES: [
        { value: 'all', label: 'All Roles' },
        { value: 'student', label: 'Students' },
        { value: 'teacher', label: 'Teachers' },
        { value: 'admin', label: 'Administrators' }
    ] as const,
    SORT: [
        { value: 'recent', label: 'Recently Joined' },
        { value: 'oldest', label: 'Oldest First' }
    ] as const
};

export const DEFAULT_FILTERS: UserFilterOptions = {
    role: 'all',
    searchQuery: '',
    sortBy: 'recent'
};
