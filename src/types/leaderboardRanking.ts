/**
 * Leaderboard Ranking Types and Constants
 * Interface Segregation: Centralized ranking configuration
 */

export interface RankingTier {
    rank: number;
    label: string;
    color: string;
    medal?: string;
}

export const RANKING_TIERS: Record<number, RankingTier> = {
    0: {
        rank: 1,
        label: '🥇 Gold',
        color: 'var(--brand-primary)',
        medal: '🥇'
    },
    1: {
        rank: 2,
        label: '🥈 Silver',
        color: '#c0c0c0',
        medal: '🥈'
    },
    2: {
        rank: 3,
        label: '🥉 Bronze',
        color: '#cd7f32',
        medal: '🥉'
    }
};

export const DEFAULT_PAGE_CONFIG = {
    PAGE_SIZE: 10,
    INITIAL_PAGE: 1
};
