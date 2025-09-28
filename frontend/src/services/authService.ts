// Authentication service for API calls
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export interface LoginCredentials {
  email_or_username: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  timezone?: string;
  language?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
  confirm_password: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private axiosInstance;

  // Configure axios instance with proper settings
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add token to all requests if available
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email_or_username });
      const response = await this.axiosInstance.post<AuthResponse>('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem(this.tokenKey, access_token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      
      console.log('✅ Login successful for user:', user.email);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      // Better error handling
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid credentials. Please check your email and password.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error(`Login failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await this.axiosInstance.post<User>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axiosInstance.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/forgot-password', data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async resetPassword(data: PasswordReset): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/reset-password', data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getDemoCredentials(): Promise<any> {
    try {
      console.log('🎭 Fetching demo credentials...');
      const response = await this.axiosInstance.get('/auth/demo-credentials');
      console.log('✅ Demo credentials loaded:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch demo credentials:', error);
      throw this.handleError(error);
    }
  }

  // Utility methods
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  private handleError(error: any): Error {
    if (error.response?.data?.detail) {
      return new Error(error.response.data.detail);
    } else if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();
export default authService;