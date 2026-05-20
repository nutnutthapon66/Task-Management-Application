import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { onRequest, onRequestError, onResponse, onResponseError } from './Interceptors'

class HttpRequest {
  public axiosInstance: AxiosInstance

  constructor(url?: string) {
    this.axiosInstance = axios.create({
      baseURL: url ?? import.meta.env.VITE_API_BASE_URL?.trim() ?? '/api',
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
    })

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => onRequest(config),
      onRequestError,
    )
    this.axiosInstance.interceptors.response.use(onResponse, onResponseError)
  }

  public get<T = never>(endPoint: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T, T>(endPoint, { params, ...config })
  }

  public post<T = never>(endPoint: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T, T>(endPoint, data, config)
  }

  public put<T = never>(endPoint: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T, T>(endPoint, data, config)
  }

  public patch<T = never>(endPoint: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch<T, T>(endPoint, data, config)
  }

  public delete<T = never>(endPoint: string, params?: object, data?: object): Promise<T> {
    return this.axiosInstance.delete<T, T>(endPoint, { params, data })
  }
}

export default HttpRequest
