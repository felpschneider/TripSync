"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { EditTripDialog } from "@/components/trips/edit-trip-dialog"
import { DeleteTripDialog } from "@/components/trips/delete-trip-dialog"

interface TripHeaderProps {
  // Novo formato (preferido)
  trip?: {
    id: string
    title: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    imageUrl?: string | null
  }
  isOrganizer?: boolean
  onTripUpdated?: () => void
  // Formato antigo (compatibilidade)
  tripTitle?: string
  tripDestination?: string
}

export function TripHeader({ trip, isOrganizer = false, onTripUpdated, tripTitle, tripDestination }: TripHeaderProps) {
  // Compatibilidade com formato antigo
  const title = trip?.title || tripTitle || ""
  const destination = trip?.destination || tripDestination || ""

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-balance">{title}</h1>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
          {isOrganizer && trip && (
            <div className="flex items-center gap-2">
              <EditTripDialog trip={trip} onTripUpdated={onTripUpdated} />
              <DeleteTripDialog tripId={trip.id} tripTitle={trip.title} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
