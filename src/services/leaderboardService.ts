/**
 * Leaderboard Service - Handles all leaderboard-related API calls
 * Dependency Inversion: Abstracts API calls from UI components
 */
import { api } from '../lib/api';
import { type UserDTO } from '../types/user';
import { User } from '../models/user'
export const leaderboardService = {
    /**
     * Fetch leaderboard data
     */
    async getLeaderboard(): Promise<User[]> {
        const response = await api.get('/leaderboard');
        const leaderboardData: UserDTO[] = response.data || [];
        return leaderboardData.map((dto: UserDTO) => User.fromDTO(dto));
    }
};
