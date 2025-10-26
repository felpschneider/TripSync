"use client"

import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { ActivityItem } from "@/components/activity/activity-item"
import { mockTrips, mockActivities } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"

export default function ActivityPage() {
  const params = useParams()
  const tripId = params.id as string

  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0]
  const activities = mockActivities.filter((a) => a.tripId === tripId)

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
