import { User } from './user.types'
import { SuccessResponseApi } from './utils.types'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  expires: number
  refresh_token: string
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponseApi<{ access_token: string }>
