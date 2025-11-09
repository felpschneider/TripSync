"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { PlaneTakeoffIcon } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    // Apply dark theme based on system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark")
    }
  }, [])

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
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <PlaneTakeoffIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            TripSync
          </h1>
        </div>
        <p className="text-muted-foreground text-pretty max-w-md">
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
