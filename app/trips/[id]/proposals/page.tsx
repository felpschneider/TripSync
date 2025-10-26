"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { ProposalCard } from "@/components/proposals/proposal-card"
import { CreateProposalDialog } from "@/components/proposals/create-proposal-dialog"
import { mockTrips, mockProposals } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProposalsPage() {
  const params = useParams()
  const tripId = params.id as string

  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0]
  const [proposals, setProposals] = useState(mockProposals.filter((p) => p.tripId === tripId))

  const handleCreateProposal = async (proposalData: { title: string; description: string }) => {
    // In production, call API
    const newProposal = {
      id: String(proposals.length + 1),
      tripId,
      ...proposalData,
      createdBy: { id: "1", name: "Nathalia Silva" },
      createdAt: new Date().toISOString(),
      votes: { yes: 0, no: 0 },
      userVote: null,
      status: "voting" as const,
    }
    setProposals([newProposal, ...proposals])
  }

  const handleVote = async (proposalId: string, vote: "yes" | "no") => {
    // In production, call API
    setProposals(
      proposals.map((p) => {
        if (p.id === proposalId) {
          const updatedVotes = { ...p.votes }
          if (p.userVote) {
            // Remove previous vote
            updatedVotes[p.userVote]--
          }
          // Add new vote
          updatedVotes[vote]++

          return {
            ...p,
            votes: updatedVotes,
            userVote: vote,
          }
        }
        return p
      }),
    )
  }

  const votingProposals = proposals.filter((p) => p.status === "voting")
  const completedProposals = proposals.filter((p) => p.status !== "voting")

  return (
    <div className="min-h-screen bg-background">
      <TripHeader tripTitle={trip.title} tripDestination={trip.destination} />
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Propostas de Roteiro</h2>
            <p className="text-muted-foreground">Vote nas sugestões do grupo para o roteiro da viagem</p>
          </div>
          <CreateProposalDialog onSubmit={handleCreateProposal} />
        </div>

        <Tabs defaultValue="voting" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="voting">Em Votação ({votingProposals.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídas ({completedProposals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="voting" className="space-y-4 mt-6">
            {votingProposals.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">Nenhuma proposta em votação no momento</p>
                <CreateProposalDialog onSubmit={handleCreateProposal} />
              </div>
            ) : (
              votingProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedProposals.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card">
                <p className="text-muted-foreground">Nenhuma proposta concluída ainda</p>
              </div>
            ) : (
              completedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
