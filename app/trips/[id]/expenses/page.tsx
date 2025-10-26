"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { BudgetSummary } from "@/components/expenses/budget-summary"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog"
import { mockTrips, mockExpenses, mockMembers } from "@/lib/mock-data"

export default function ExpensesPage() {
  const params = useParams()
  const tripId = params.id as string

  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0]
  const [expenses, setExpenses] = useState(mockExpenses.filter((e) => e.tripId === tripId))
  const members = mockMembers
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleAddExpense = async (expenseData: any) => {
    // In production, call API
    const newExpense = {
      id: String(expenses.length + 1),
      tripId,
      ...expenseData,
      paidBy: members.find((m) => m.id === expenseData.paidById)!,
      participants: members.filter((m) => expenseData.participantIds.includes(m.id)),
    }
    setExpenses([newExpense, ...expenses])
  }

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense)
  }

  const handleDeleteExpense = async (expenseId: string) => {
    // In production, call API
    setExpenses(expenses.filter((e) => e.id !== expenseId))
  }

  return (
    <div className="min-h-screen bg-background">
      <TripHeader tripTitle={trip.title} tripDestination={trip.destination} />
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <BudgetSummary budget={trip.budget} totalSpent={totalSpent} memberCount={trip.memberCount} />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Despesas</h2>
            <p className="text-muted-foreground">{expenses.length} despesas registradas</p>
          </div>
          <ExpenseFormDialog members={members} onSubmit={handleAddExpense} editExpense={editingExpense} />
        </div>

        <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
      </main>
    </div>
  )
}
