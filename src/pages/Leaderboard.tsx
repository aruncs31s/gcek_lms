/**
 * Leaderboard Page - Displays user rankings and points
 * Architecture follows SOLID principles:
 * - S: Single Responsibility: Orchestrates sub-components
 * - O: Open/Closed: Ranking tiers are easily configurable
 * - I: Interface Segregation: Separate concerns via components
 * - D: Dependency Inversion: Uses service abstraction via custom hook
 */
import { useLeaderboard } from '../hooks/useLeaderboard';
import LeaderboardList from '../components/LeaderboardList';
import LeaderboardLoadingState from '../components/LeaderboardLoadingState';
import LeaderboardEmptyState from '../components/LeaderboardEmptyState';

export default function Leaderboard() {
    const {
        users,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize
    } = useLeaderboard();

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    Global Leaderboard
                </h1>
                <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    See who's leading the pack. Complete courses and earn points to climb the ranks!
                </p>
            </div>

            {/* Content Section */}
            {error && (
                <div
                    className="glass-panel"
                    style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        borderRadius: '12px',
                        background: 'rgba(243, 139, 168, 0.1)',
                        border: '1px solid rgba(243, 139, 168, 0.3)',
                        marginBottom: '2rem'
                    }}
                >
                    <p className="text-muted">{error}</p>
                </div>
            )}

            {loading ? (
                <LeaderboardLoadingState />
            ) : users.length === 0 ? (
                <LeaderboardEmptyState />
            ) : (
                <LeaderboardList
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
