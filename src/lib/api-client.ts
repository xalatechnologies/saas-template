import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AppError, AuthenticationError } from '@/utils';
import type { ApiResponse, ApiError } from '@/types';

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Clear auth token and redirect to login
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
          return Promise.reject(new AuthenticationError());
        }

        const apiError = error.response?.data;
        if (apiError) {
          return Promise.reject(
            new AppError(apiError.message, apiError.code, error.response?.status)
          );
        }

        return Promise.reject(
          new AppError(
            error.message || 'Network error',
            'NETWORK_ERROR',
            error.response?.status || 500
          )
        );
      }
    );
  }

  public async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    return response.data.data;
  }

  public async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');