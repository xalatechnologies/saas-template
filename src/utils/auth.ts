import { AuthUser } from '@/types';

/**
 * Authentication utility functions
 */

/**
 * Set authentication token in cookies
 */
export const setAuthToken = (token: string, user: AuthUser): void => {
  // Set httpOnly cookie via document.cookie (client-side)
  // In production, you'd make an API call to set secure httpOnly cookies
  document.cookie = `auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
  
  // Store user data in localStorage for client-side access
  localStorage.setItem('auth-user', JSON.stringify(user));
};

/**
 * Remove authentication token from cookies
 */
export const removeAuthToken = (): void => {
  // Remove cookie
  document.cookie = 'auth-token=; Path=/; Max-Age=0';
  
  // Remove user data from localStorage
  localStorage.removeItem('auth-user');
};

/**
 * Get stored user data (client-side only)
 */
export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('auth-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated (client-side)
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const user = getStoredUser();
  return !!user;
};

/**
 * Generate mock JWT token for demo purposes
 * In production, this would come from your backend API
 */
export const generateMockToken = (email: string): string => {
  const payload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };
  
  // This is a mock implementation - use proper JWT in production
  return btoa(JSON.stringify(payload));
};

/**
 * Validate token (mock implementation)
 * In production, this would verify JWT signature and expiration
 */
export const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

/**
 * API simulation utilities
 */
export const mockApi = {
  /**
   * Simulate login API call
   */
  login: async (email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation (accept any email/password for demo)
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Generate mock user and token
    const user: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1`,
    };
    
    const token = generateMockToken(email);
    
    return { user, token };
  },
  
  /**
   * Simulate signup API call
   */
  signup: async (name: string, email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Generate mock user and token
    const user: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1`,
    };
    
    const token = generateMockToken(email);
    
    return { user, token };
  },
};