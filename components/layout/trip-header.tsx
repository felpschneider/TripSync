import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

interface TripHeaderProps {
  tripTitle: string
  tripDestination: string
}

export function TripHeader({ tripTitle, tripDestination }: TripHeaderProps) {
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
            <h1 className="text-xl font-bold text-balance">{tripTitle}</h1>
            <p className="text-sm text-muted-foreground">{tripDestination}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
