import { API_BASE_URL, API_TIMEOUT_MS, USE_MOCK_FALLBACK } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Standard API Client
 * Wraps browser fetch with automatic JSON parsing, auth token header,
 * timeout handling, and seamless mock fallback.
 */
class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getAuthToken() {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    // If mock fallback is enabled and we are not forcing live calls, throw to let the caller use mock/local data
    if (USE_MOCK_FALLBACK && !options.forceLive) {
      throw new Error('MOCK_MODE_ACTIVE');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || API_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.message || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = errorBody;
        throw error;
      }

      // If empty response (e.g. 204 No Content)
      if (response.status === 204) return null;

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Request to ${endpoint} timed out after ${API_TIMEOUT_MS}ms`);
      }
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
