"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { ActivityItem } from "@/components/activity/activity-item"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"

export default function ActivityPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripData, activitiesData] = await Promise.all([
          api.trips.get(tripId),
          api.activities.list(tripId)
        ])
        setTrip(tripData)
        setActivities(activitiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tripId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Viagem não encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TripHeader tripTitle={trip.title} tripDestination={trip.destination} />
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Feed de Atividades</h2>
          <p className="text-muted-foreground">Acompanhe todas as atualizações da viagem em tempo real</p>
        </div>

        {activities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma atividade registrada ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
