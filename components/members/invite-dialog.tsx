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
import { UserPlusIcon, CopyIcon, CheckIcon, LinkIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface InviteDialogProps {
  onInvite: (email: string) => Promise<{ inviteLink?: string; message?: string; added?: boolean }>
}

export function InviteDialog({ onInvite }: InviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await onInvite(email)
      
      if (result.added) {
        // Usuário foi adicionado diretamente
        toast.success(result.message || 'Usuário adicionado à viagem com sucesso!')
        handleClose()
        window.location.reload() // Recarregar para mostrar novo membro
      } else {
        // Convite criado
        setInviteLink(result.inviteLink || '')
        toast.success(result.message || 'Convite enviado por e-mail!')
      }
      setEmail("")
    } catch (error: any) {
      console.error("Error creating invite:", error)
      toast.error(error?.message || 'Erro ao enviar convite')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setLoading(true)
    try {
      // Generate a generic invite link
      const result = await onInvite("")
      setInviteLink(result.inviteLink)
    } catch (error) {
      console.error("Error generating link:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setOpen(false)
    setInviteLink("")
    setEmail("")
    setCopied(false)
    setActiveTab("email")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Convidar Membro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!inviteLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Convidar Membro</DialogTitle>
              <DialogDescription>Escolha como deseja convidar alguém para a viagem</DialogDescription>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Por Email</TabsTrigger>
                <TabsTrigger value="link">Gerar Link</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email do Convidado</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="amigo@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Um email será enviado com o link de convite</p>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar Convite"}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
              <TabsContent value="link" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    <p>Gere um link de convite para compartilhar como preferir</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Qualquer pessoa com este link poderá entrar na viagem</p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleGenerateLink} disabled={loading}>
                    {loading ? "Gerando..." : "Gerar Link"}
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Convite Gerado!</DialogTitle>
              <DialogDescription>Compartilhe este link com o convidado</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Link de Convite</Label>
                <div className="flex gap-2">
                  <Input value={inviteLink} readOnly className="font-mono text-sm" />
                  <Button type="button" size="icon" onClick={handleCopy}>
                    {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-xs text-green-600">Link copiado!</p>}
                <p className="text-xs text-muted-foreground">
                  Este link permite que a pessoa entre na viagem sem precisar de senha
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Fechar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
