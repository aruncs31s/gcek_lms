/**
 * Leaderboard Ranking Utilities
 * Single Responsibility: Each function handles one specific task
 */
import { RANKING_TIERS, type RankingTier } from '../types/leaderboardRanking';

/**
 * Get ranking tier for a given index
 */
export function getRankingTier(index: number): RankingTier | null {
    return RANKING_TIERS[index] || null;
}

/**
 * Get medal color for a given index
 */
export function getMedalColor(index: number): string {
    const tier = getRankingTier(index);
    return tier?.color || 'transparent';
}

/**
 * Check if user is in top 3
 */
export function isTopThree(index: number): boolean {
    return index < 3;
}

/**
 * Get medal emoji for a given index
 */
export function getMedalEmoji(index: number): string | undefined {
    const tier = getRankingTier(index);
    return tier?.medal;
}
