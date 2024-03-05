import { User } from '@/types/user.types'

type TokenType = 'access_token' | 'refresh_token'

export const LocalStorageEventTarget = new EventTarget()

export const getTokenFromLS = (key: TokenType) => localStorage.getItem(key) || ''

export const setTokenToLS = (key: TokenType, value: string) => localStorage.setItem(key, value)

export const clearDataFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getProfileFormLS = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}
export const setProfileToLS = (profile: User) => localStorage.setItem('profile', JSON.stringify(profile))
