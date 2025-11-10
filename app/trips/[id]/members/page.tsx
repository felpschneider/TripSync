"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { MemberCard } from "@/components/members/member-card"
import { InviteDialog } from "@/components/members/invite-dialog"
import { ExportPdfButton } from "@/components/members/export-pdf-button"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function MembersPage() {
  const params = useParams()
  const tripId = params.id as string
  const { user } = useAuth()

  const [trip, setTrip] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripData, membersData] = await Promise.all([
          api.trips.get(tripId),
          api.members.list(tripId)
        ])
        setTrip(tripData)
        setMembers(membersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tripId])

  const handleInvite = async (email: string) => {
    try {
      const result = await api.members.invite(tripId, email)
      return result
    } catch (error) {
      console.error("Error inviting member:", error)
      throw error
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    toast("Tem certeza que deseja remover este membro?", {
      action: {
        label: "Remover",
        onClick: async () => {
          try {
            await api.members.remove(tripId, memberId)
            setMembers(members.filter((m) => m.id !== memberId))
            toast.success("Membro removido com sucesso!")
          } catch (error) {
            console.error("Error removing member:", error)
            toast.error("Erro ao remover membro")
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Viagem não encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TripHeader tripTitle={trip.title} tripDestination={trip.destination} />
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Membros da Viagem</h2>
            <p className="text-muted-foreground">{members.length} participantes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportPdfButton tripId={tripId} tripTitle={trip.title} />
            <InviteDialog onInvite={handleInvite} />
          </div>
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum membro na viagem ainda</p>
              <InviteDialog onInvite={handleInvite} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} currentUserId={user?.id || ""} onRemove={handleRemoveMember} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
