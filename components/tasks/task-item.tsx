"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  assignedTo: { id: string; name: string }
  completed: boolean
  dueDate: string
}

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDateOnly = new Date(dueDate)
  dueDateOnly.setHours(0, 0, 0, 0)

  const isOverdue = dueDateOnly < today && !task.completed
  const isDueSoon =
    dueDateOnly.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000 &&
    dueDateOnly.getTime() >= today.getTime() &&
    !task.completed

  return (
    <Card className={cn("hover:shadow-md transition-shadow", task.completed && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
            id={`task-${task.id}`}
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={cn("font-medium cursor-pointer text-balance", task.completed && "line-through")}
            >
              {task.title}
            </label>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{task.assignedTo.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{dueDate.toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex gap-2">
                {isOverdue && <Badge variant="destructive">Atrasada</Badge>}
                {isDueSoon && (
                  <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                    Prazo próximo
                  </Badge>
                )}
                {task.completed && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                    Concluída
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
