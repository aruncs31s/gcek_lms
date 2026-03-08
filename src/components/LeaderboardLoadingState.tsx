/**
 * LeaderboardLoadingState Component - Displays loading state
 * Single Responsibility: Only displays loading UI
 */
export default function LeaderboardLoadingState() {
    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div
                style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid var(--border-color)',
                    borderTopColor: 'var(--brand-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            ></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Loading leaderboard...
            </p>
        </div>
    );
}
