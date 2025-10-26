"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { TripHeader } from "@/components/layout/trip-header"
import { TripNav } from "@/components/layout/trip-nav"
import { TaskItem } from "@/components/tasks/task-item"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { mockTrips, mockTasks, mockMembers } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  const params = useParams()
  const tripId = params.id as string

  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0]
  const [tasks, setTasks] = useState(mockTasks.filter((t) => t.tripId === tripId))
  const members = mockMembers

  const handleCreateTask = async (taskData: { title: string; assignedToId: string; dueDate: string }) => {
    // In production, call API
    const newTask = {
      id: String(tasks.length + 1),
      tripId,
      title: taskData.title,
      assignedTo: members.find((m) => m.id === taskData.assignedToId)!,
      dueDate: taskData.dueDate,
      completed: false,
    }
    setTasks([newTask, ...tasks])
  }

  const handleToggleTask = async (taskId: string) => {
    // In production, call API
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="min-h-screen bg-background">
      <TripHeader tripTitle={trip.title} tripDestination={trip.destination} />
      <TripNav tripId={tripId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
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
      </main>
    </div>
  )
}
