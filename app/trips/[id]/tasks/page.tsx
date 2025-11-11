"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { TaskItem } from "@/components/tasks/task-item"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { api } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function TasksPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripData, tasksData, membersData] = await Promise.all([
          api.trips.get(tripId),
          api.tasks.list(tripId),
          api.members.list(tripId)
        ])
        setTrip(tripData)
        setTasks(tasksData)
        setMembers(membersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tripId])

  const handleCreateTask = async (taskData: { title: string; assignedToId: string; dueDate: string }) => {
    try {
      const newTask = await api.tasks.create(tripId, taskData)
      setTasks([newTask, ...tasks])
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Erro ao criar tarefa. Tente novamente.")
    }
  }

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await api.tasks.toggleComplete(tripId, taskId)
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    } catch (error) {
      console.error("Error toggling task:", error)
      toast.error("Erro ao atualizar tarefa. Tente novamente.")
    }
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

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
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
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
            <h2 className="text-2xl font-bold">Tarefas e Responsabilidades</h2>
            <p className="text-muted-foreground">Organize e acompanhe as tarefas do grupo</p>
          </div>
          <CreateTaskDialog members={members} onSubmit={handleCreateTask} />
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pendentes ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídas ({completedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-6">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card">
                <p className="text-muted-foreground mb-4">Todas as tarefas foram concluídas!</p>
                <CreateTaskDialog members={members} onSubmit={handleCreateTask} />
              </div>
            ) : (
              pendingTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-6">
            {completedTasks.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card">
                <p className="text-muted-foreground">Nenhuma tarefa concluída ainda</p>
              </div>
            ) : (
              completedTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />)
            )}
          </TabsContent>
        </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
