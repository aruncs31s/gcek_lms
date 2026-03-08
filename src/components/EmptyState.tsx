/**
 * EmptyState Component - Renders empty state UI
 * Single Responsibility: Only displays empty state message
 */
import { UserIcon } from '@heroicons/react/24/outline';

export default function EmptyState() {
    return (
        <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
            <UserIcon style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)', margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                No members found
            </h3>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                Try adjusting your role filters to see more results.
            </p>
        </div>
    );
}
