import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  WalletIcon,
  MapIcon,
  CheckSquareIcon,
  UserPlusIcon,
  CalendarIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
  user: { id: string; name: string }
}

interface ActivityItemProps {
  activity: Activity
}

const activityConfig: Record<
  string,
  {
    icon: LucideIcon
    color: string
  }
> = {
  expense_added: {
    icon: WalletIcon,
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  proposal_created: {
    icon: MapIcon,
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  },
  task_completed: {
    icon: CheckSquareIcon,
    color: "bg-green-500/10 text-green-700 dark:text-green-400",
  },
  member_joined: {
    icon: UserPlusIcon,
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  },
  trip_created: {
    icon: CalendarIcon,
    color: "bg-primary/10 text-primary",
  },
  budget_updated: {
    icon: TrendingUpIcon,
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  },
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = activityConfig[activity.type] || activityConfig.trip_created
  const Icon = config.icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins}m atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full", config.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-pretty">{activity.message}</p>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{getInitials(activity.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
