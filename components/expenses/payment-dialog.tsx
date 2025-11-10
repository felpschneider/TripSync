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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CopyIcon, CheckIcon, QrCodeIcon, UploadIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Expense {
  id: string
  description: string
  amount: number
  paidBy: { id: string; name: string; pixKey?: string }
  participants: { id: string; name: string }[]
}

interface PaymentDialogProps {
  expense: Expense
  open: boolean
  onClose: () => void
}

export function PaymentDialog({ expense, open, onClose }: PaymentDialogProps) {
  const [copied, setCopied] = useState(false)
  const [paid, setPaid] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const amountPerPerson = expense.amount / expense.participants.length
  const pixKey = expense.paidBy.pixKey
  const hasPixKey = !!pixKey

  const handleCopyPix = async () => {
    if (!pixKey) return
    await navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
    }
  }

  const handleMarkAsPaid = async () => {
    setLoading(true)
    try {
      // TODO: Call API to mark payment as completed
      // await api.post(`/expenses/${expense.id}/payments`, { receipt })
      console.log("Marking as paid:", { expenseId: expense.id, receipt: receipt?.name })
      setPaid(true)
      setTimeout(() => {
        onClose()
        setPaid(false)
        setReceipt(null)
      }, 1500)
    } catch (error) {
      console.error("Error marking payment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pagar Despesa</DialogTitle>
          <DialogDescription>{expense.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Amount to pay */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
                <p className="text-3xl font-bold text-primary">R$ {amountPerPerson.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* PIX Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Dados PIX de {expense.paidBy.name}</Label>
            </div>

            {hasPixKey ? (
              <div className="space-y-2">
                <Label htmlFor="pix-key" className="text-sm text-muted-foreground">
                  Chave PIX
                </Label>
                <div className="flex gap-2">
                  <Input id="pix-key" value={pixKey} readOnly className="font-mono text-sm" />
                  <Button type="button" size="icon" onClick={handleCopyPix} variant="outline">
                    {copied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-xs text-green-600">Chave PIX copiada!</p>}
              </div>
            ) : (
              <Card className="bg-orange-500/10 border-orange-500/20">
                <CardContent className="p-4">
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    ⚠️ {expense.paidBy.name} ainda não configurou uma chave PIX no perfil.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Entre em contato com {expense.paidBy.name} para obter as informações de pagamento.
                  </p>
                </CardContent>
              </Card>
            )}</div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt" className="text-sm">
              Comprovante (opcional)
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {receipt ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <UploadIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm truncate">{receipt.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => setReceipt(null)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="receipt" className="cursor-pointer">
                  <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Clique para enviar imagem ou PDF</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou PDF até 5MB</p>
                </label>
              )}
              <Input id="receipt" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          {paid && (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckIcon className="h-5 w-5" />
                  <p className="text-sm font-medium">Pagamento registrado com sucesso!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleMarkAsPaid} disabled={loading || paid}>
            {loading ? "Registrando..." : paid ? "Pago" : "Marcar como Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
