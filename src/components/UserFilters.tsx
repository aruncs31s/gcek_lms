/**
 * UserFilters Component - Handles role and sort filtering UI
 * Single Responsibility: Only renders filter and sort controls
 */
import { FunnelIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { FilterRole, SortOption } from '../types/userFilters';
import { FILTER_OPTIONS } from '../types/userFilters';

interface UserFiltersProps {
    filterRole: FilterRole;
    onFilterRoleChange: (role: FilterRole) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export default function UserFilters({
    filterRole,
    onFilterRoleChange,
    sortBy,
    onSortChange
}: UserFiltersProps) {
    return (
        <div
            className="filter-bar"
            style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '2.5rem',
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                maxWidth: 'fit-content',
                margin: '2.5rem auto 0 auto'
            }}
        >
            {/* Filter Label */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}
            >
                <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Filters
                </span>
            </div>

            {/* Role Filter */}
            <select
                className="form-input"
                style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                value={filterRole}
                onChange={(e) => onFilterRoleChange(e.target.value as FilterRole)}
            >
                {FILTER_OPTIONS.ROLES.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Sort Label */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    marginLeft: '1rem'
                }}
            >
                <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Sort
                </span>
            </div>

            {/* Sort Select */}
            <select
                className="form-input"
                style={{ width: 'auto', minWidth: '160px', padding: '0.55rem 1rem' }}
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
                {FILTER_OPTIONS.SORT.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
