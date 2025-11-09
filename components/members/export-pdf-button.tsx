"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface ExportPdfButtonProps {
  tripId: string
  tripTitle: string
}

export function ExportPdfButton({ tripId, tripTitle }: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const { url } = await api.export.pdf(tripId)
      window.open(url, '_blank')
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Erro ao exportar PDF. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading} className="gap-2 bg-transparent">
      <DownloadIcon className="h-4 w-4" />
      {loading ? "Gerando PDF..." : "Exportar Resumo"}
    </Button>
  )
}
