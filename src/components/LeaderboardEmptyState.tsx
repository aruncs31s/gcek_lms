/**
 * LeaderboardEmptyState Component - Displays empty state
 * Single Responsibility: Only displays empty state UI
 */
export default function LeaderboardEmptyState() {
    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: '1.25rem' }}>
                No data available yet. Start completing courses to appear on the leaderboard!
            </p>
        </div>
    );
}
