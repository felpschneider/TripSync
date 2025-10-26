"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-balance mb-2">Viagem em Grupo</h1>
        <p className="text-muted-foreground text-pretty">
          Organize suas viagens com amigos de forma simples e transparente
        </p>
      </div>
      {mode === "login" ? (
        <LoginForm onToggleMode={() => setMode("signup")} />
      ) : (
        <SignupForm onToggleMode={() => setMode("login")} />
      )}
    </main>
  )
}
