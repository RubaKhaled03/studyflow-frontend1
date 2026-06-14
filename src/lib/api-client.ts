/**
 * Centralized API Client for StudyFlow
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, params } = options;

  // Build URL with query parameters
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  // Define default headers
  const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
       "Accept": "application/json",
        ...headers,
     };

  // Get auth token from localStorage if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("studyflow_auth_token") : null;
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url.toString(), config);
    
    // Handle specific status codes
    if (response.status === 401) {
      // Unauthorized - handle logout or token refresh if needed
      console.warn("Unauthorized request - potential session expiry");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // Handle empty responses
    if (response.status === 204) return {} as T;

    return await response.json();
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: "GET", params, headers }),
    
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: "POST", body, headers }),
    
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: "PUT", body, headers }),
    
  delete: <T>(endpoint: string, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: "DELETE", headers }),
};
