import type { LoginResponse } from "./login";
export interface RegisterRequest {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: 'student' | 'instructor';
    avatar_url?: string;
}

export interface RegisterResponse extends LoginResponse {}