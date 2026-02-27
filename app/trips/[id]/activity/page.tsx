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

  return (
    <div className="min-h-screen bg-background">
      {trip ? (
        <TripHeader 
          trip={{
            id: trip.id,
            title: trip.title,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
            imageUrl: trip.imageUrl
          }}
          isOrganizer={trip.isOrganizer}
        />
      ) : (
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </header>
      )}
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : !trip ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Viagem não encontrada</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  )
}
