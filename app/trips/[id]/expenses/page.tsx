"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { BudgetSummary } from "@/components/expenses/budget-summary"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { UserIcon, UsersIcon, FilterIcon } from "lucide-react"
import { toast } from "sonner"

export default function ExpensesPage() {
  const params = useParams()
  const tripId = params.id as string
  const { user } = useAuth()

  const [trip, setTrip] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all") // "all" | "mine"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripData, expensesData, membersData] = await Promise.all([
          api.trips.get(tripId),
          api.expenses.list(tripId),
          api.members.list(tripId)
        ])
        setTrip(tripData)
        setExpenses(expensesData)
        setMembers(membersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tripId])

  // Filtrar despesas
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      const matchesUser = userFilter === "all" || expense.paidBy?.id === user?.id
      return matchesCategory && matchesUser
    })
  }, [expenses, categoryFilter, userFilter, user])

  // Estatísticas
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const myExpenses = expenses.filter(e => e.paidBy?.id === user?.id)
  const myTotalSpent = myExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  
  // Categorias únicas
  const categories = useMemo(() => {
    const cats = new Set(expenses.map(e => e.category).filter(Boolean))
    return Array.from(cats)
  }, [expenses])

  const handleAddOrUpdateExpense = async (expenseData: any) => {
    try {
      if (editingExpense) {
        // UPDATE
        const updatedExpense = await api.expenses.update(tripId, editingExpense.id, expenseData)
        setExpenses(expenses.map((e) => (e.id === editingExpense.id ? updatedExpense : e)))
        setEditingExpense(null)
      } else {
        // CREATE
        const newExpense = await api.expenses.create(tripId, expenseData)
        setExpenses([newExpense, ...expenses])
      }
    } catch (error) {
      console.error("Error saving expense:", error)
      toast.error("Erro ao salvar despesa. Tente novamente.")
    }
  }

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense)
  }

  const handleDeleteExpense = async (expenseId: string) => {
    toast("Tem certeza que deseja excluir esta despesa?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          try {
            await api.expenses.delete(tripId, expenseId)
            setExpenses(expenses.filter((e) => e.id !== expenseId))
            toast.success("Despesa excluída com sucesso!")
          } catch (error) {
            console.error("Error deleting expense:", error)
            toast.error("Erro ao excluir despesa. Tente novamente.")
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
        <BudgetSummary budget={trip.budget} totalSpent={totalSpent} memberCount={trip.memberCount} />

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                Total Gasto pelo Grupo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{expenses.length} despesas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Você Pagou
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">R$ {myTotalSpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{myExpenses.length} despesas suas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Despesas</h2>
            <p className="text-muted-foreground">
              {filteredExpenses.length} de {expenses.length} despesas
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro de Categoria */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro de Usuário */}
            <div className="flex gap-1 border rounded-md">
              <Button
                variant={userFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserFilter("all")}
              >
                <UsersIcon className="h-4 w-4 mr-1" />
                Todas
              </Button>
              <Button
                variant={userFilter === "mine" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserFilter("mine")}
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Minhas
              </Button>
            </div>

            <ExpenseFormDialog members={members} onSubmit={handleAddOrUpdateExpense} editExpense={editingExpense} />
          </div>
        </div>

        <ExpenseList expenses={filteredExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
      </main>
    </div>
  )
}
