"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    content: string
    timestamp: string
  }
  isCurrentUser: boolean
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const initials = message.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn("flex gap-3 mb-4", isCurrentUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col gap-1 max-w-[70%]", isCurrentUser && "items-end")}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {!isCurrentUser && <span className="font-medium">{message.userName}</span>}
          <span>{new Date(message.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm",
            isCurrentUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm",
          )}
        >
          <p className="text-pretty break-words">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
