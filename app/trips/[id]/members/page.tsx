"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { MemberCard } from "@/components/members/member-card"
import { InviteDialog } from "@/components/members/invite-dialog"
import { ExportPdfButton } from "@/components/members/export-pdf-button"
import { mockTrips, mockMembers } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"

export default function MembersPage() {
  const params = useParams()
  const tripId = params.id as string

  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0]
  const [members, setMembers] = useState(mockMembers)
  const currentUserId = "1" // In production, get from auth context

  const handleInvite = async (email: string) => {
    // In production, call API
    // const result = await api.members.invite(tripId, email);

    // Mock invite
    const inviteLink = `${window.location.origin}/invite/${tripId}/${Math.random().toString(36).substring(7)}`
    return { inviteLink }
  }

  const handleRemoveMember = async (memberId: string) => {
    // In production, call API
    // await api.members.remove(tripId, memberId);

    // Mock removal
    if (confirm("Tem certeza que deseja remover este membro?")) {
      setMembers(members.filter((m) => m.id !== memberId))
    }
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
              <MemberCard key={member.id} member={member} currentUserId={currentUserId} onRemove={handleRemoveMember} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
