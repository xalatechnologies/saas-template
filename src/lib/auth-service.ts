import { apiClient } from './api-client';
import type { AuthUser, LoginCredentials } from '@/types';

export class AuthService {
  public async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const response = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', credentials);
    
    // Store token in localStorage
    localStorage.setItem('auth-token', response.token);
    
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always remove token, even if API call fails
      localStorage.removeItem('auth-token');
    }
  }

  public async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  }

  public async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    localStorage.setItem('auth-token', response.token);
    return response;
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  public isAuthenticated(): boolean {
    return this.getStoredToken() !== null;
  }
}

export const authService = new AuthService();