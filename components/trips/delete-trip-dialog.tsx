"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TrashIcon } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface DeleteTripDialogProps {
  tripId: string
  tripTitle: string
}

export function DeleteTripDialog({ tripId, tripTitle }: DeleteTripDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      await api.trips.delete(tripId)
      toast.success("Viagem deletada com sucesso!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error deleting trip:", error)
      toast.error(error.message || "Erro ao deletar viagem. Tente novamente.")
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <TrashIcon className="h-4 w-4" />
          Deletar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Viagem</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a viagem <strong>&quot;{tripTitle}&quot;</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita. Todos os dados relacionados (despesas, propostas, tarefas, etc.) serão
            permanentemente deletados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? "Deletando..." : "Sim, deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

