"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { BudgetSummary } from "@/components/expenses/budget-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { CalendarIcon, AlertCircleIcon } from "lucide-react"

export default function TripDashboardPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tripData, expensesData, tasksData] = await Promise.all([
        api.trips.get(tripId),
        api.expenses.list(tripId),
        api.tasks.list(tripId)
      ])
      setTrip(tripData)
      setExpenses(expensesData)
      setTasks(tasksData.filter((t: any) => !t.completed))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tripId])

  const handleTripUpdated = () => {
    // Recarregar dados da viagem após atualização
    fetchData()
  }

  const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

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
            <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 space-y-3">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="border rounded-lg p-6 space-y-3">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        ) : !trip ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Viagem não encontrada</p>
          </div>
        ) : (
          <>
        {trip.imageUrl && (
          <div className="relative h-64 w-full rounded-lg overflow-hidden border">
            <img 
              src={trip.imageUrl} 
              alt={trip.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Se a imagem falhar ao carregar, esconder o container
                e.currentTarget.parentElement?.classList.add('hidden')
              }}
            />
          </div>
        )}
        <BudgetSummary budget={trip.budget} totalSpent={totalSpent} memberCount={trip.memberCount} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Informações da Viagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Destino</p>
                <p className="font-medium">{trip.destination}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-medium">
                  {new Date(trip.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(trip.endDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participantes</p>
                <p className="font-medium">{trip.memberCount} pessoas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5" />
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Todas as tarefas foram concluídas!</p>
              ) : (
                <ul className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.assignedTo.name} • Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma despesa registrada ainda</p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString("pt-BR")} • {expense.paidBy.name}
                      </p>
                    </div>
                    <p className="font-bold">R$ {expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </main>
    </div>
  )
}
