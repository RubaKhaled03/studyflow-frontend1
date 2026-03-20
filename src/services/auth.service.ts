import { apiClient } from "@/lib/api-client";
import { UserProfile } from "@/types/settings";

/**
 * Service for authentication and user profile management
 */
export const AuthService = {
  /**
   * Login user and store token
   */
  async login(credentials: any) {
    const response = await apiClient.post<{ token: string; user: UserProfile }>("/auth/login", credentials);
    if (response.token) {
      localStorage.setItem("studyflow_auth_token", response.token);
    }
    return response;
  },

  /**
   * Register a new user
   */
  async register(data: any) {
    return apiClient.post<{ message: string }>("/auth/register", data);
  },

  /**
   * Send password reset link
   */
  async forgotPassword(email: string) {
    return apiClient.post<{ message: string }>("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: any) {
    return apiClient.post<{ message: string }>("/auth/reset-password", data);
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    return apiClient.get<UserProfile>("/auth/profile");
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("studyflow_auth_token");
    window.location.href = "/login";
  }
};
