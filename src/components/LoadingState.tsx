/**
 * LoadingState Component - Renders loading UI
 * Single Responsibility: Only displays loading state
 */

export default function LoadingState() {
    return (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
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
                Loading community members...
            </p>
        </div>
    );
}
