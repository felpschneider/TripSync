"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trips/trip-card"
import { CreateTripDialog } from "@/components/trips/create-trip-dialog"
import { mockTrips } from "@/lib/mock-data"
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react"

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState(mockTrips)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleCreateTrip = async (tripData: any) => {
    // In production, call API
    // const newTrip = await api.trips.create(tripData);

    // Mock creation
    const newTrip = {
      id: String(trips.length + 1),
      ...tripData,
      totalSpent: 0,
      memberCount: 1,
      imageUrl: "/diverse-travel-destinations.png",
    }
    setTrips([newTrip, ...trips])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Viagem em Grupo</h1>
            <p className="text-sm text-muted-foreground">Olá, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOutIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-balance">Suas Viagens</h2>
            <p className="text-muted-foreground mt-1">Gerencie e organize suas aventuras em grupo</p>
          </div>
          <CreateTripDialog onCreateTrip={handleCreateTrip} />
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Você ainda não tem viagens cadastradas</p>
            <CreateTripDialog onCreateTrip={handleCreateTrip} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
