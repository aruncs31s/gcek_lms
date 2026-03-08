/**
 * Users Page - Main page for browsing community members
 * Architecture follows SOLID principles:
 * - S: Single Responsibility: Orchestrates sub-components
 * - O: Open/Closed: Easy to add new filters/features
 * - I: Interface Segregation: Separate concerns via components
 * - D: Dependency Inversion: Uses service abstraction via custom hook
 */
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserSearchBar from '../components/UserSearchBar';
import UserFilters from '../components/UserFilters';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import UsersGrid from '../components/UsersGrid';

export default function Users() {
    // Page state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // User data and filtering state
    const {
        users,
        loading,
        filterRole,
        setFilterRole,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery
    } = useUsers();

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header Section */}
            <div
                className="glass-panel search-hero-section"
                style={{
                    padding: '3rem 2rem',
                    marginBottom: '3rem',
                    borderRadius: '24px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.05) 0%, rgba(245, 194, 231, 0.05) 100%)',
                    border: '1px solid var(--border-color)'
                }}
            >
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
                    Community Members
                </h1>
                <p
                    className="text-secondary"
                    style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}
                >
                    Connect with fellow students, expert instructors, and platform administrators.
                </p>

                {/* Search Bar */}
                <UserSearchBar value={searchQuery} onChange={setSearchQuery} />

                {/* Filters */}
                <UserFilters
                    filterRole={filterRole}
                    onFilterRoleChange={setFilterRole}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            {/* Content Section */}
            {loading ? (
                <LoadingState />
            ) : users.length === 0 ? (
                <EmptyState />
            ) : (
                <UsersGrid
                    users={users}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }}
                />
            )}
        </div>
    );
}
