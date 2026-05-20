import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers = config.headers ?? {}
  return config
}

export function onRequestError(error: AxiosError): Promise<never> {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

export function onResponse<T = unknown>(response: AxiosResponse<T>): Promise<T> {
  if (!response?.data) {
    return Promise.reject(response)
  }
  return Promise.resolve(response.data)
}

export function onResponseError(error: AxiosError): Promise<never> {
  return Promise.reject(error.response?.data ?? error)
}
