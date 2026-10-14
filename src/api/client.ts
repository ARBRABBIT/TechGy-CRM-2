import { API_BASE_URL, API_TIMEOUT_MS, USE_MOCK_FALLBACK } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  /** Abort after this many ms (defaults to API_TIMEOUT_MS) */
  timeout?: number;
  /** Call the real API even when mock fallback is enabled */
  forceLive?: boolean;
}

/** Error thrown for non-2xx responses, carrying the status and parsed body. */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard API Client
 * Wraps browser fetch with automatic JSON parsing, auth token header,
 * timeout handling, and seamless mock fallback.
 */
class ApiClient {
  baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // If mock fallback is enabled and we are not forcing live calls, throw to let the caller use mock/local data
    if (USE_MOCK_FALLBACK && !options.forceLive) {
      throw new Error('MOCK_MODE_ACTIVE');
    }

    const { timeout, forceLive: _forceLive, headers: extraHeaders, ...init } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extraHeaders || {})
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || API_TIMEOUT_MS);

    try {
      const response = await fetch(url, { ...init, headers, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => ({}));
        const message = (errorBody as { message?: string })?.message || `HTTP error ${response.status}`;
        throw new ApiError(message, response.status, errorBody);
      }

      // If empty response (e.g. 204 No Content)
      if (response.status === 204) return null as T;

      return (await response.json()) as T;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Request to ${endpoint} timed out after ${API_TIMEOUT_MS}ms`);
      }
      throw err;
    }
  }

  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });
  }

  patch<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
