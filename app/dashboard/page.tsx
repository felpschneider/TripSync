"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trips/trip-card"
import { CreateTripDialog } from "@/components/trips/create-trip-dialog"
import { LogOutIcon, MoonIcon, SunIcon, PlaneTakeoffIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<any[]>([])
  const [tripsLoading, setTripsLoading] = useState(true)
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

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return
      
      try {
        setTripsLoading(true)
        const tripsData = await api.trips.list()
        setTrips(tripsData)
      } catch (error) {
        console.error("Error fetching trips:", error)
      } finally {
        setTripsLoading(false)
      }
    }
    fetchTrips()
  }, [user])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleCreateTrip = async (tripData: any) => {
    try {
      const newTrip = await api.trips.create(tripData)
      setTrips([newTrip, ...trips])
    } catch (error) {
      console.error("Error creating trip:", error)
      toast.error("Erro ao criar viagem. Tente novamente.")
    }
  }

  if (loading || tripsLoading) {
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <PlaneTakeoffIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TripSync</h1>
              <p className="text-sm text-muted-foreground">Olá, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
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
