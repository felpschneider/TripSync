"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface ExportPdfButtonProps {
  tripId: string
  tripTitle: string
}

export function ExportPdfButton({ tripId, tripTitle }: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // In production, call API to generate PDF
      // const { url } = await api.export.pdf(tripId);
      // window.open(url, '_blank');

      // Mock export
      alert(
        `Exportando resumo da viagem "${tripTitle}" em PDF...\n\nEm produção, isso geraria um PDF com:\n- Resumo de orçamento\n- Lista de despesas\n- Propostas aprovadas\n- Tarefas concluídas\n- Lista de membros`,
      )
    } catch (error) {
      console.error("Error exporting PDF:", error)
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
