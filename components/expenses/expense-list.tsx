"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, UserIcon, EditIcon, TrashIcon, CreditCardIcon, EyeIcon } from "lucide-react"
import { PaymentDialog } from "./payment-dialog"
import { ExpenseDetailDialog } from "./expense-detail-dialog"
import { useAuth } from "@/contexts/auth-context"

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  paidBy: { id: string; name: string; pixKey?: string }
  participants: { id: string; name: string }[]
  splitMethod: string
  category: string
  proofImageUrl?: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expenseId: string) => void
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

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const { user } = useAuth()
  const [paymentExpense, setPaymentExpense] = useState<Expense | null>(null)
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null)

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Nenhuma despesa cadastrada ainda</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {expenses.map((expense) => {
          const isPaidByOther = expense.paidBy.id !== user?.id
          const isPaidByMe = expense.paidBy.id === user?.id
          const isParticipant = expense.participants.some((p) => p.id === user?.id)
          const shouldShowPayButton = isPaidByOther && isParticipant

          return (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-balance">{expense.description}</h3>
                      <Badge className={categoryColors[expense.category] || categoryColors.other}>
                        {categoryLabels[expense.category] || "Outro"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(expense.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>
                          Pago por {expense.paidBy.name} • {expense.participants.length} participantes
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {shouldShowPayButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => setPaymentExpense(expense)}
                        >
                          <CreditCardIcon className="h-4 w-4" />
                          Pagar
                        </Button>
                      )}
                      {isPaidByMe && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => setDetailExpense(expense)}
                        >
                          <EyeIcon className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-right">
                      <p className="text-xl font-bold">R$ {expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        R$ {(expense.amount / expense.participants.length).toFixed(2)} / pessoa
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)}>
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {paymentExpense && (
        <PaymentDialog expense={paymentExpense} open={!!paymentExpense} onClose={() => setPaymentExpense(null)} />
      )}
      
      {detailExpense && (
        <ExpenseDetailDialog expense={detailExpense} open={!!detailExpense} onClose={() => setDetailExpense(null)} />
      )}
    </>
  )
}
