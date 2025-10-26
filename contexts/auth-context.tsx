"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api"

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
      // In production, validate token with backend
      // For now, use mock user
      setUser({
        id: "1",
        name: "Nathalia Silva",
        email: "nathalia@example.com",
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In production, call real API
      // const { token, user } = await api.auth.login(email, password);

      // Mock login for demo
      const mockToken = "mock-jwt-token-" + Date.now()
      setAuthToken(mockToken)
      setUser({
        id: "1",
        name: "Nathalia Silva",
        email,
      })
    } catch (error) {
      throw new Error("Falha no login. Verifique suas credenciais.")
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      // In production, call real API
      // const { token, user } = await api.auth.signup(email, password, name);

      // Mock signup for demo
      const mockToken = "mock-jwt-token-" + Date.now()
      setAuthToken(mockToken)
      setUser({
        id: "1",
        name,
        email,
      })
    } catch (error) {
      throw new Error("Falha no cadastro. Tente novamente.")
    }
  }

  const logout = () => {
    removeAuthToken()
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
