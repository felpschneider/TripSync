import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, WalletIcon } from "lucide-react"

interface BudgetSummaryProps {
  budget: number
  totalSpent: number
  memberCount: number
}

export function BudgetSummary({ budget, totalSpent, memberCount }: BudgetSummaryProps) {
  const remaining = budget - totalSpent
  const percentage = (totalSpent / budget) * 100
  const perPerson = totalSpent / memberCount

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <WalletIcon className="h-4 w-4" />
            Orçamento Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {budget.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4" />
            Total Gasto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
          <Progress value={percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% do orçamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDownIcon className="h-4 w-4" />
            Saldo Restante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${remaining < 0 ? "text-destructive" : ""}`}>R$ {remaining.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Média por Pessoa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {perPerson.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{memberCount} participantes</p>
        </CardContent>
      </Card>
    </div>
  )
}
