"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { MessageSquareIcon } from "lucide-react"
import { toast } from "sonner"

export default function ChatPage() {
  const params = useParams()
  const tripId = params.id as string
  const { user } = useAuth()
  
  const [trip, setTrip] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripData, messagesData] = await Promise.all([
          api.trips.get(tripId),
          api.messages.list(tripId)
        ])
        setTrip(tripData)
        setMessages(messagesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tripId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    try {
      const newMessage = await api.messages.send(tripId, content)
      setMessages((prev) => [...prev, newMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Erro ao enviar mensagem. Tente novamente.")
    }
  }

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

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <Card className="flex flex-col h-[calc(100vh-300px)]">
            <CardHeader className="border-b">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-16 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
            <div className="border-t p-4">
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ) : !trip ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Viagem não encontrada</p>
          </div>
        ) : (
          <>
        <Card className="flex flex-col h-[calc(100vh-300px)]">
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
          </>
        )}
      </main>
    </div>
  )
}
