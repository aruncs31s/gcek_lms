import { api } from '../lib/api';
import type { RegisterRequest, RegisterResponse } from '../pages/auth/register';

export const registerUser = async (formData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/register', formData);
    return response.data;
};
