"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { UserIcon, CalendarIcon, CreditCardIcon, ImageIcon } from "lucide-react"

interface ExpenseDetailDialogProps {
  expense: {
    id: string
    description: string
    amount: number
    date: string
    category: string
    paidBy: { id: string; name: string; pixKey?: string }
    participants: { id: string; name: string }[]
    splitMethod: string
    proofImageUrl?: string
  } | null
  open: boolean
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  accommodation: "Hospedagem",
  food: "Alimentação",
  transport: "Transporte",
  activity: "Atividade",
  other: "Outro",
}

const categoryColors: Record<string, string> = {
  accommodation: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  food: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  transport: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  activity: "bg-green-500/10 text-green-700 dark:text-green-400",
  other: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

export function ExpenseDetailDialog({ expense, open, onClose }: ExpenseDetailDialogProps) {
  if (!expense) return null

  const amountPerPerson = expense.amount / expense.participants.length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {expense.description}
            <Badge className={categoryColors[expense.category] || categoryColors.other}>
              {categoryLabels[expense.category] || "Outro"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Valor Total */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Valor Total</h3>
            <p className="text-3xl font-bold">R$ {expense.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              R$ {amountPerPerson.toFixed(2)} por pessoa
            </p>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Data
            </h3>
            <p>{new Date(expense.date).toLocaleDateString("pt-BR", {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}</p>
          </div>

          {/* Quem Pagou */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" />
              Pago por
            </h3>
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{expense.paidBy.name}</span>
            </div>
            {expense.paidBy.pixKey && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Chave PIX</p>
                <p className="font-mono text-sm">{expense.paidBy.pixKey}</p>
              </div>
            )}
          </div>

          {/* Participantes */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Participantes ({expense.participants.length})
            </h3>
            <div className="space-y-2">
              {expense.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <span className="text-sm">{participant.name}</span>
                  <span className="text-sm font-medium">R$ {amountPerPerson.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comprovante */}
          {expense.proofImageUrl && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Comprovante
              </h3>
              <div className="rounded-lg border overflow-hidden">
                <img
                  src={expense.proofImageUrl}
                  alt="Comprovante de pagamento"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = '<p class="p-4 text-sm text-muted-foreground">Erro ao carregar comprovante</p>'
                  }}
                />
              </div>
              <a
                href={expense.proofImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-block mt-2"
              >
                Abrir comprovante em nova aba →
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

