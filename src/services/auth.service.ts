import { apiClient } from "@/lib/api-client";
import { UserProfile } from "@/types/settings";
import { AppStore } from "@/lib/store/app-store";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ForgotPasswordResponse {
  message: string;
  token: string;
  email: string;
}

interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Service for authentication and user profile management
 */
export const AuthService = {
  /**
   * Login user and store token
   */
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<{ token: string; user: UserProfile }>("/auth/login", credentials);
    if (response.token) {
      localStorage.setItem("studyflow_auth_token", response.token);
      localStorage.setItem("studyflow_user", JSON.stringify(response.user));
      AppStore.update({ userProfile: response.user });
    }
    return response;
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    return apiClient.post<{ message: string }>("/auth/register", data);
  },

  /**
   * Send password reset link
   */
  async forgotPassword(email: string) {
    return apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData) {
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
    localStorage.removeItem("studyflow_user");
    AppStore.reset();
    window.location.href = "/login";
  }
};