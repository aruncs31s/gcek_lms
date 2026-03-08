/**
 * UserAvatarCircle Component - Displays user avatar with optional medal border
 * Single Responsibility: Only handles avatar display
 */
import { getMedalColor, isTopThree } from '../utils/leaderboardRanking';

interface UserAvatarCircleProps {
    avatarUrl: string;
    rank: number;
}

export default function UserAvatarCircle({ avatarUrl, rank }: UserAvatarCircleProps) {
    return (
        <div
            style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundImage: `url(${avatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'var(--bg-tertiary)',
                border: isTopThree(rank) ? `2px solid ${getMedalColor(rank)}` : 'none'
            }}
        />
    );
}
