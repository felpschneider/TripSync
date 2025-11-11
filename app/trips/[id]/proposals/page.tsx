"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { ProposalCard } from "@/components/proposals/proposal-card"
import { CreateProposalDialog } from "@/components/proposals/create-proposal-dialog"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProposalsPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripData, proposalsData] = await Promise.all([
        api.trips.get(tripId),
        api.proposals.list(tripId)
      ])
      setTrip(tripData)
      setProposals(proposalsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

  const handleCreateProposal = async (proposalData: { title: string; description: string }) => {
    try {
      const newProposal = await api.proposals.create(tripId, proposalData)
      setProposals([newProposal, ...proposals])
    } catch (error) {
      console.error("Error creating proposal:", error)
      toast.error("Erro ao criar proposta. Tente novamente.")
    }
  }

  const handleVote = async (proposalId: string, vote: "yes" | "no") => {
    try {
      const updatedProposal = await api.proposals.vote(tripId, proposalId, vote)
      setProposals(proposals.map((p) => (p.id === proposalId ? updatedProposal : p)))
    } catch (error) {
      console.error("Error voting on proposal:", error)
      toast.error("Erro ao votar. Tente novamente.")
    }
  }

  const handleFinalize = async (proposalId: string) => {
    toast("Tem certeza que deseja finalizar esta proposta? A votação será encerrada.", {
      action: {
        label: "Finalizar",
        onClick: async () => {
          try {
            const finalizedProposal = await api.proposals.finalize(tripId, proposalId)
            setProposals(proposals.map((p) => (p.id === proposalId ? finalizedProposal : p)))
            toast.success("Proposta finalizada com sucesso!")
          } catch (error) {
            console.error("Error finalizing proposal:", error)
            toast.error("Erro ao finalizar proposta. Tente novamente.")
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    })
  }

  const handleTripUpdated = () => {
    fetchData()
  }

  const votingProposals = proposals.filter((p) => p.status === "voting")
  const completedProposals = proposals.filter((p) => p.status !== "voting")

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
          onTripUpdated={handleTripUpdated}
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : !trip ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Viagem não encontrada</p>
          </div>
        ) : (
          <>
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
                <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} onFinalize={handleFinalize} />
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
                <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} onFinalize={handleFinalize} />
              ))
            )}
          </TabsContent>
        </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
