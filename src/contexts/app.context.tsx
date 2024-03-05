import React, { createContext, useContext, useState } from 'react'
import { getProfileFormLS, getTokenFromLS } from '@/utils/auth'
import { User } from '@/types/user.types'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getTokenFromLS('access_token')),
  setIsAuthenticated: () => null,
  profile: getProfileFormLS(),
  setProfile: () => null,
  reset: () => null
}

const AppContext = createContext<AppContextInterface>(initialAppContext)

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }
  const values = { isAuthenticated, setIsAuthenticated, profile, setProfile, reset }

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}
const useAppContext = () => {
  const context = useContext(AppContext)
  if (typeof context === 'undefined') throw new Error('useAppContext must be used within AppProvider')
  return context
}

export { AppContextProvider, useAppContext }
