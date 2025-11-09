"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, UserIcon, KeyIcon, CreditCardIcon, ImageIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [profileImage, setProfileImage] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const profileData = await api.profile.get()
        setProfile(profileData)
        setName(profileData.name || "")
        setPixKey(profileData.pixKey || "")
        setProfileImage(profileData.profileImageUrl || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }
    
    if (newPassword && newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    try {
      setSaving(true)
      
      const updateData: any = {
        name,
        pixKey,
        profileImageUrl: profileImage
      }
      
      if (newPassword && currentPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }
      
      await api.profile.update(updateData)
      
      toast.success("Perfil atualizado com sucesso!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Recarregar perfil
      const profileData = await api.profile.get()
      setProfile(profileData)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error?.message || "Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Atualize seu nome e imagem de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileImage" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  URL da Imagem de Perfil
                </Label>
                <Input
                  id="profileImage"
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                />
                {profileImage && (
                  <div className="mt-2">
                    <img 
                      src={profileImage} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Altere sua senha (deixe em branco para manter a atual)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Chave PIX
              </CardTitle>
              <CardDescription>Configure sua chave PIX para receber pagamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                />
                <p className="text-xs text-muted-foreground">
                  Sua chave PIX será exibida para outros membros quando você pagar despesas
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

