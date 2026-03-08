/**
 * RankBadge Component - Displays rank number
 * Single Responsibility: Only displays rank badge
 */
import { getMedalColor } from '../utils/leaderboardRanking';

interface RankBadgeProps {
    rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
    return (
        <div
            style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: rank < 3 ? getMedalColor(rank) : 'var(--text-muted)',
                minWidth: '40px'
            }}
        >
            #{rank + 1}
        </div>
    );
}
