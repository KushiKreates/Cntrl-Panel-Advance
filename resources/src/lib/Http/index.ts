import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

class Http {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '',
      withCredentials: true,      // send cookies with requests (important for session auth)
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': window.Laravel.csrfToken, // Laravel's CSRF token from SSR
        'Content-Type': 'application/json'
      },
    })

    // Handle common response scenarios
    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      (err: AxiosError) => {
        if (err.response?.status === 401) {
          console.error('Unauthorized access');
          // Optionally redirect to login page if needed
          // window.location.href = '/login';
        } else if (err.response?.status === 419) {
          console.error('CSRF token mismatch, refreshing page');
          // Refresh the page to get a new CSRF token
          window.location.reload();
        } else {
          console.error('API Error:', err.response?.data || err.message);
        }
        return Promise.reject(err);
      }
    )
  }

  // Generic request method
  public async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
    try {
      const res = await this.client.request<T>(cfg);
      return res.data;
    } catch (error) {
      console.error('Request failed:', cfg.url);
      throw error;
    }
  }

  // Convenience methods
  public get<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'get', url });
  }

  public post<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'post', url, data });
  }

  public patch<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'patch', url, data });
  }

  public put<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'put', url, data });
  }

  public delete<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'delete', url });
  }
}

// Export a singleton instance
export default new Http();