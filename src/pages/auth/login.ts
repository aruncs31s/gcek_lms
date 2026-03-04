import type { User } from '../../types/user';

export interface LoginResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}