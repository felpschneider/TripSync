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

  useEffect(() => {
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
    fetchData()
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
      </main>
    </div>
  )
}
