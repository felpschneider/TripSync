"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setAuthToken, removeAuthToken, getAuthToken, api } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = getAuthToken()
    if (token) {
      // Token exists, user is authenticated
      // User data will be fetched on first API call
      // For now, we just mark as authenticated
      const storedUser = localStorage.getItem("user_data")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Call real API
      const { token, user } = await api.auth.login(email, password)
      
      setAuthToken(token)
      localStorage.setItem("user_data", JSON.stringify(user))
      setUser(user)
    } catch (error: any) {
      console.error("Erro no login:", error)
      throw new Error(error.message || "Falha no login. Verifique suas credenciais.")
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Call real API
      const { token, user } = await api.auth.signup(email, password, name)
      
      setAuthToken(token)
      localStorage.setItem("user_data", JSON.stringify(user))
      setUser(user)
    } catch (error: any) {
      console.error("Erro no cadastro:", error)
      throw new Error(error.message || "Falha no cadastro. Tente novamente.")
    }
  }

  const logout = () => {
    removeAuthToken()
    localStorage.removeItem("user_data")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
