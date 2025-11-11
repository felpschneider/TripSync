"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PencilIcon } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface EditTripDialogProps {
  trip: {
    id: string
    title: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    imageUrl?: string | null
  }
  onTripUpdated?: () => void
}

export function EditTripDialog({ trip, onTripUpdated }: EditTripDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: trip.title,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget.toString(),
    imageUrl: trip.imageUrl || "",
  })

  // Atualizar formData quando trip mudar
  useEffect(() => {
    setFormData({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget.toString(),
      imageUrl: trip.imageUrl || "",
    })
  }, [trip])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.trips.update(trip.id, {
        ...formData,
        budget: Number.parseFloat(formData.budget),
        imageUrl: formData.imageUrl || undefined,
      })
      toast.success("Viagem atualizada com sucesso!")
      setOpen(false)
      onTripUpdated?.()
    } catch (error: any) {
      console.error("Error updating trip:", error)
      toast.error(error.message || "Erro ao atualizar viagem. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PencilIcon className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Viagem</DialogTitle>
            <DialogDescription>Atualize os detalhes da viagem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Viagem</Label>
              <Input
                id="title"
                placeholder="Ex: Final de semana em Campos do Jordão"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                placeholder="Ex: Campos do Jordão, SP"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento Previsto (R$)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                placeholder="5000.00"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Foto de Capa (opcional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Cole a URL de uma imagem para usar como capa da viagem
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

