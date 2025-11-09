import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UsersIcon, TrendingUpIcon } from "lucide-react"

interface TripCardProps {
  trip: {
    id: string
    title: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    totalSpent: number
    userSpent?: number
    owedToUser?: number
    memberCount: number
    imageUrl: string
  }
}

export function TripCard({ trip }: TripCardProps) {
  const budgetPercentage = (trip.totalSpent / trip.budget) * 100
  const remaining = trip.budget - trip.totalSpent

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 w-full bg-muted">
          <img src={trip.imageUrl || "/placeholder.svg"} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3">
            <Badge variant={budgetPercentage > 90 ? "destructive" : "secondary"} className="bg-background/90">
              {budgetPercentage.toFixed(0)}% gasto
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg text-balance">{trip.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{trip.destination}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(trip.startDate).toLocaleDateString("pt-BR")} -{" "}
              {new Date(trip.endDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <span>{trip.memberCount} participantes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              R$ {remaining.toFixed(2)} restante de R$ {trip.budget.toFixed(2)}
            </span>
          </div>
          {trip.userSpent !== undefined && (
            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Você pagou:</span>
                <span className="font-semibold text-primary">R$ {trip.userSpent.toFixed(2)}</span>
              </div>
              {trip.owedToUser !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {trip.owedToUser >= 0 ? "Te devem:" : "Você deve:"}
                  </span>
                  <span className={`font-semibold ${trip.owedToUser >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    R$ {Math.abs(trip.owedToUser).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
