/**
 * User Service - Handles all user-related API calls
 * Dependency Inversion: Abstracts API calls from UI components
 */
import { api } from '../lib/api';
import { User } from '../types/user';
import type { UserDTO } from '../types/user';

export interface UserQueryParams {
    query?: string;
    userType?: string;
    limit?: number;
    offset?: number;
}

export const userService = {
    /**
     * Fetch all users with optional filters
     */
    async getUsers(params: UserQueryParams): Promise<User[]> {
        const response = await api.get('/users', { params });
        const users = response.data.users || [];
        return users.map((dto: UserDTO) => User.fromDTO(dto));
    },

    /**
     * Search users by query
     */
    async searchUsers(query: string): Promise<User[]> {
        const response = await api.get('/users/search', {
            params: { query: query.trim() }
        });
        const users = response.data.users || [];
        return users.map((dto: UserDTO) => User.fromDTO(dto));
    }
};
