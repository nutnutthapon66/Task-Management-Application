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
  if (!response) {
    return Promise.reject(response)
  }
  // 204 No Content — resolve with undefined (void endpoints)
  if (response.status === 204) {
    return Promise.resolve(undefined as T)
  }
  return Promise.resolve(response.data)
}

export function onResponseError(error: AxiosError): Promise<never> {
  console.error('[response error]', error.response?.status, error.response?.data ?? error.message)
  return Promise.reject(error.response?.data ?? error)
}
