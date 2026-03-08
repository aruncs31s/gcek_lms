/**
 * LeaderboardRow Component - Renders a single leaderboard row
 * Uses composition of sub-components following Single Responsibility Principle
 */
import type { User } from '../types/user';
import RankBadge from './RankBadge';
import UserAvatarCircle from './UserAvatarCircle';
import UserInfo from './UserInfo';
import PointsDisplay from './PointsDisplay';
import RankAccentBar from './RankAccentBar';
import { getMedalColor, isTopThree } from '../utils/leaderboardRanking';

interface LeaderboardRowProps {
    user: User;
    globalIndex: number;
}

export default function LeaderboardRow({ user, globalIndex }: LeaderboardRowProps) {
    return (
        <div
            className="glass-panel leaderboard-row"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                gap: '1.5rem',
                transition: 'transform 0.2s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
            {/* Top 3 accent bar */}
            {isTopThree(globalIndex) && (
                <RankAccentBar color={getMedalColor(globalIndex)} />
            )}

            {/* Rank badge */}
            <RankBadge rank={globalIndex} />

            {/* User avatar */}
            <UserAvatarCircle avatarUrl={user.avatar} rank={globalIndex} />

            {/* User info */}
            <UserInfo
                firstName={user.firstName}
                lastName={user.lastName}
                enrolledCourses={user.enrolledCourses || 0}
            />

            {/* Points display */}
            <PointsDisplay points={user.totalPoins} />
        </div>
    );
}
