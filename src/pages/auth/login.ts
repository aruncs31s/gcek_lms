import type { UserDTO } from '../../types/user';

export interface LoginResponse {
    user: UserDTO;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}