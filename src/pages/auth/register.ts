import type { LoginResponse } from "./login";
export interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'instructor';
    avatar_url?: string;
}

export type RegisterResponse = LoginResponse