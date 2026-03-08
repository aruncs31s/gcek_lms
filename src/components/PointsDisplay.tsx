/**
 * PointsDisplay Component - Displays user points
 * Single Responsibility: Only displays points information
 */
interface PointsDisplayProps {
    points: number;
}

export default function PointsDisplay({ points }: PointsDisplayProps) {
    return (
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-secondary)' }}>
                {points}
            </div>
            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Points
            </div>
        </div>
    );
}
