"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { useAuth } from "@/contexts/auth-context"
import { MessageSquareIcon } from "lucide-react"

// Mock data - replace with API calls
const mockMessages = [
  {
    id: "1",
    userId: "2",
    userName: "Carlos Silva",
    content: "Pessoal, consegui uma promoção no hotel! Vou compartilhar o link.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    userName: "Nathalia Santos",
    content: "Que ótimo! Quanto ficou?",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "3",
    userId: "2",
    userName: "Carlos Silva",
    content: "R$ 450 a diária para quarto duplo. Bem melhor que os R$ 600 que estávamos vendo!",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: "4",
    userId: "3",
    userName: "Ana Costa",
    content: "Perfeito! Já podemos reservar então?",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
]

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // TODO: Call API to send message
    // await api.post(`/trips/${params.id}/messages`, { content })

    const newMessage = {
      id: Date.now().toString(),
      userId: user?.id || "1",
      userName: user?.name || "Você",
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="flex flex-col h-[calc(100vh-200px)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5 text-primary" />
            Chat da Viagem
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Nenhuma mensagem ainda. Seja o primeiro a conversar!</p>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isCurrentUser={message.userId === user?.id} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        <ChatInput onSend={handleSendMessage} />
      </Card>
    </div>
  )
}
