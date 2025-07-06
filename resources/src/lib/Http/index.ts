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
  private csrfInitialized = false

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '',
      withCredentials: true, // send cookies with requests (important for session auth)
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': window.Laravel?.csrfToken || '', // Laravel's CSRF token from SSR
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
          
          // If the user is on an authenticated page, redirect to login
          if (window.location.pathname.startsWith('/home')) {
            window.location.href = '/auth/login'
          }
        } else if (err.response?.status === 419) {
          toast.error('Session expired, refreshing CSRF token...')
          console.error('CSRF token mismatch, refreshing token')
          
          // Try to refresh the CSRF token before reloading
          this.initCsrfToken().then(() => {
            window.location.reload()
          })
        } else {
          console.error('API Error:', err.response?.data || err.message)
        }
        return Promise.reject(err)
      }
    )
  }

  // Initialize CSRF token
  public async initCsrfToken(): Promise<void> {
    try {
      // Use a separate axios instance to avoid circular dependencies
      const response = await axios.get('/sanctum/csrf-cookie', {
        baseURL: import.meta.env.VITE_API_BASE_URL || '',
        withCredentials: true
      })
      
      console.log('CSRF cookie set', response)
      
      // Get the token from the cookie
      const token = this.getCsrfTokenFromCookie()
      if (token) {
        this.client.defaults.headers['X-CSRF-TOKEN'] = token
        this.client.defaults.headers['X-XSRF-TOKEN'] = token
      }
      
      this.csrfInitialized = true
      return Promise.resolve()
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error)
      return Promise.reject(error)
    }
  }
  
  // Extract CSRF token from cookies
  private getCsrfTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  // Generic request method
  public async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
    // Try to initialize CSRF if not already done
    if (!this.csrfInitialized) {
      try {
        await this.initCsrfToken()
      } catch (error) {
        console.warn('Could not initialize CSRF token, proceeding anyway')
      }
    }
    
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