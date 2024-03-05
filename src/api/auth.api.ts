import { AuthResponse } from '@/types/auth.types'
import http from '@/utils/http'

export const AUTH_URL = {
  URL_LOGIN: '/login',
  URL_REGISTER: '/register',
  URL_LOGOUT: '/logout',
  URL_REFRESH_TOKEN: '/refresh-access-token'
}

const AuthApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(AUTH_URL.URL_REGISTER, body),
  login: (body: { email: string; password: string }) => http.post<AuthResponse>(AUTH_URL.URL_LOGIN, body),
  logout: () => http.post(AUTH_URL.URL_LOGOUT)
}

export default AuthApi
