"use client"

import type React from "react"

import { useState } from "react"
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
import { PlusIcon } from "lucide-react"

interface CreateTripDialogProps {
  onCreateTrip: (trip: {
    title: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    imageUrl?: string
  }) => Promise<void>
}

export function CreateTripDialog({ onCreateTrip }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onCreateTrip({
        ...formData,
        budget: Number.parseFloat(formData.budget),
        imageUrl: formData.imageUrl || undefined,
      })
      setOpen(false)
      setFormData({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        imageUrl: "",
      })
    } catch (error) {
      console.error("Error creating trip:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <PlusIcon className="h-5 w-5" />
          Nova Viagem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Viagem</DialogTitle>
            <DialogDescription>Preencha os detalhes da sua próxima aventura em grupo</DialogDescription>
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
              {loading ? "Criando..." : "Criar Viagem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
