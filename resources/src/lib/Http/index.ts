import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { toast } from 'sonner'

class Http {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '',
      withCredentials: true, // send cookies with requests (important for session auth)
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': window.Laravel.csrfToken, // Laravel's CSRF token from SSR
        'Content-Type': 'application/json'
      },
    })

    // Start NProgress on request
    this.client.interceptors.request.use((config: AxiosRequestConfig) => {
      NProgress.start()
      return config
    })

    // Handle common response scenarios and stop NProgress
    this.client.interceptors.response.use(
      (res: AxiosResponse) => {
        NProgress.done()
        return res
      },
      (err: AxiosError) => {
        NProgress.done()
        if (err.response?.status === 401) {
          console.error('Unauthorized access')
          toast.error('Unauthorized access, please log in again.')
          // Optionally redirect to login page if needed
          // window.location.href = '/login'
        } else if (err.response?.status === 419) {
          toast.error('Session expired,Automatic refershing started.')
          console.error('CSRF token mismatch, refreshing page')
          // Refresh the page to get a new CSRF token
          window.location.reload()
        } else {
          console.error('API Error:', err.response?.data || err.message)
        }
        return Promise.reject(err)
      }
    )
  }

  // Generic request method
  public async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
    try {
      const res = await this.client.request<T>(cfg)
      if (res.status >= 200 && res.status < 300) {
        // Handle success response
        if (res.data.success === false) {
          // If API returns a success flag, handle it

          toast.error("Your request failed: " + (res.data.message || 'Unknown error'))
          
         
        }
      } else {
        // Handle non-2xx responses
        toast.error(`Error: ${res.status} - ${res.statusText}`)
      }
      return res.data
    } catch (error) {
      console.error('Request failed:', cfg.url)
      throw error
    }
  }

  // Convenience methods
  public get<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    
    return this.request<T>({ ...cfg, method: 'get', url })
  }

  public post<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'post', url, data })
  }

  public patch<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'patch', url, data })
  }

  public put<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'put', url, data })
  }

  public delete<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...cfg, method: 'delete', url })
  }
}

// Export a singleton instance
export default new Http()