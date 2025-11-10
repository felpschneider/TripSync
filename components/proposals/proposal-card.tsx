"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ThumbsUpIcon, ThumbsDownIcon, UserIcon, CalendarIcon } from "lucide-react"

interface Proposal {
  id: string
  title: string
  description: string
  createdBy: { id: string; name: string }
  createdAt: string
  votes: {
    yes: number
    no: number
  }
  userVote: "yes" | "no" | null
  status: "voting" | "approved" | "rejected"
}

interface ProposalCardProps {
  proposal: Proposal
  onVote: (proposalId: string, vote: "yes" | "no") => void
  onFinalize?: (proposalId: string) => void
}

export function ProposalCard({ proposal, onVote, onFinalize }: ProposalCardProps) {
  const totalVotes = proposal.votes.yes + proposal.votes.no
  const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0

  const statusConfig = {
    voting: { label: "Em votação", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    approved: { label: "Aprovada", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
    rejected: { label: "Rejeitada", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-balance mb-2">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground text-pretty">{proposal.description}</p>
          </div>
          <Badge className={statusConfig[proposal.status].color}>{statusConfig[proposal.status].label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>{proposal.createdBy.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(proposal.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Resultado da votação</span>
            <span className="font-medium">
              {proposal.votes.yes} a favor • {proposal.votes.no} contra
            </span>
          </div>
          <Progress value={yesPercentage} className="h-2" />
        </div>

        {proposal.status === "voting" && (
          <>
            <div className="flex gap-2 pt-2">
              <Button
                variant={proposal.userVote === "yes" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => onVote(proposal.id, "yes")}
              >
                <ThumbsUpIcon className="h-4 w-4" />A favor
              </Button>
              <Button
                variant={proposal.userVote === "no" ? "destructive" : "outline"}
                className="flex-1 gap-2"
                onClick={() => onVote(proposal.id, "no")}
              >
                <ThumbsDownIcon className="h-4 w-4" />
                Contra
              </Button>
            </div>

            {proposal.userVote && (
              <p className="text-xs text-center text-muted-foreground">
                Você votou {proposal.userVote === "yes" ? "a favor" : "contra"} desta proposta
              </p>
            )}

            {onFinalize && totalVotes > 0 && (
              <Button
                variant="secondary"
                className="w-full mt-2"
                onClick={() => onFinalize(proposal.id)}
              >
                Finalizar Votação
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
