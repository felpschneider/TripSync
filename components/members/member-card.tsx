"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MailIcon, TrashIcon } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  role: string
}

interface MemberCardProps {
  member: Member
  currentUserId: string
  onRemove: (memberId: string) => void
}

export function MemberCard({ member, currentUserId, onRemove }: MemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isOrganizer = member.role === "organizer"
  const isCurrentUser = member.id === currentUserId

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg font-semibold">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-balance">{member.name}</h3>
              {isOrganizer && <Badge className="bg-primary/10 text-primary">Organizador</Badge>}
              {isCurrentUser && <Badge variant="outline">Você</Badge>}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MailIcon className="h-3 w-3" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
          {!isOrganizer && !isCurrentUser && (
            <Button variant="ghost" size="icon" onClick={() => onRemove(member.id)}>
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
