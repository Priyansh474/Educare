import { create } from 'zustand';
import { authAPI } from '../api/client';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('accessToken') || localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  signup: async (name, email, password, role = 'student') => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.signup({ name, email, password, role });
      // Backend returns: { success: true, message: '...', data: { accessToken, refreshToken, user } }
      const responseData = response.data;
      const authData = responseData.data || responseData; // Handle both formats
      const { user, accessToken, refreshToken, token } = authData;
      const finalToken = accessToken || token;
      
      if (!finalToken || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('accessToken', finalToken);
      localStorage.setItem('token', finalToken); // Backward compatibility
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: finalToken, isLoading: false });
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      // Backend returns: { success: true, message: '...', data: { accessToken, refreshToken, user } }
      const responseData = response.data;
      
      // Check if response has success field
      if (responseData.success === false) {
        const errorMessage = responseData.message || 'Login failed';
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
      
      const authData = responseData.data || responseData; // Handle both formats
      const { user, accessToken, refreshToken, token } = authData;
      const finalToken = accessToken || token;
      
      if (!finalToken || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('accessToken', finalToken);
      localStorage.setItem('token', finalToken); // Backward compatibility
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: finalToken, isLoading: false, error: null });
      return user;
    } catch (error) {
      // Extract error message from various possible formats
      let message = 'Login failed';
      if (error.response?.data) {
        const errorData = error.response.data;
        message = errorData.message || errorData.error || message;
      } else if (error.message) {
        message = error.message;
      }
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));
