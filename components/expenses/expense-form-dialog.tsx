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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, UsersIcon } from "lucide-react"

interface Member {
  id: string
  name: string
}

interface ExpenseFormDialogProps {
  members: Member[]
  onSubmit: (expense: any) => Promise<void>
  editExpense?: any
  trigger?: React.ReactNode
}

export function ExpenseFormDialog({ members, onSubmit, editExpense, trigger }: ExpenseFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paidById: "",
    category: "other",
    splitMethod: "equal",
  })
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  useEffect(() => {
    if (editExpense) {
      setFormData({
        description: editExpense.description,
        amount: editExpense.amount.toString(),
        date: editExpense.date,
        paidById: editExpense.paidBy.id,
        category: editExpense.category,
        splitMethod: editExpense.splitMethod,
      })
      setSelectedParticipants(editExpense.participants.map((p: any) => p.id))
      setOpen(true)
    }
  }, [editExpense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        amount: Number.parseFloat(formData.amount),
        participantIds: selectedParticipants,
      })
      setOpen(false)
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paidById: "",
        category: "other",
        splitMethod: "equal",
      })
      setSelectedParticipants([])
    } catch (error) {
      console.error("Error submitting expense:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (memberId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const handleSelectAll = () => {
    if (selectedParticipants.length === members.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(members.map((m) => m.id))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <PlusIcon className="h-5 w-5" />
            Nova Despesa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editExpense ? "Editar Despesa" : "Adicionar Despesa"}</DialogTitle>
            <DialogDescription>Registre uma despesa da viagem e divida entre os participantes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Jantar no restaurante"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accommodation">Hospedagem</SelectItem>
                  <SelectItem value="food">Alimentação</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="activity">Atividade</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidBy">Pago por</Label>
              <Select
                value={formData.paidById}
                onValueChange={(value) => setFormData({ ...formData, paidById: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione quem pagou" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Participantes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2 h-8 bg-transparent"
                >
                  <UsersIcon className="h-3.5 w-3.5" />
                  {selectedParticipants.length === members.length ? "Desmarcar todos" : "Selecionar todos"}
                </Button>
              </div>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`participant-${member.id}`}
                      checked={selectedParticipants.includes(member.id)}
                      onCheckedChange={() => toggleParticipant(member.id)}
                    />
                    <Label htmlFor={`participant-${member.id}`} className="cursor-pointer">
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{selectedParticipants.length} selecionados</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="splitMethod">Método de Divisão</Label>
              <Select
                value={formData.splitMethod}
                onValueChange={(value) => setFormData({ ...formData, splitMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Dividir igualmente</SelectItem>
                  <SelectItem value="custom">Divisão customizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || selectedParticipants.length === 0}>
              {loading ? "Salvando..." : editExpense ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
