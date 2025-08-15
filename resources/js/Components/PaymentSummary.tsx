import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function PaymentSummary({
  total,
  paid,
  status,
}: {
  total: number
  paid: number
  status?: string
}) {
  const percentage = status === "cancelled" ? 100 : Math.min((paid / total) * 100, 100)

  const progressColor = cn({
    "[&>div]:bg-green-500": status === "completed",
    "[&>div]:bg-yellow-500": status === "pending",
    "[&>div]:bg-red-500": status === "cancelled",
    "[&>div]:bg-blue-500": !status, // default
  })

  const statusColor = cn({
    "text-green-600": status === "completed",
    "text-yellow-600": status === "pending",
    "text-red-600": status === "cancelled",
    "text-blue-600": !status,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }
  const statusText = paid === 0 ? "unpaid" : status;

  return (
    <div className="flex flex-col items-center gap-0 h-full justify-center">
      {/* Amount Display - más compacto */}
      <div className="text-xs text-gray-700 whitespace-nowrap">
        <span className="font-semibold">{formatCurrency(paid)}</span>{status !== "completed" && <> / {total.toFixed(2)}</>}
      </div>

      {/* Progress Bar - más pequeña */}
      <div className="w-[70%]">
        <Progress className={cn("h-1", progressColor)} value={percentage} />
      </div>

      {/* Status - solo texto sin badge */}
      {status && <div className={cn("text-xs font-medium capitalize whitespace-nowrap", statusColor)}>{statusText}</div>}
    </div>
  )
}
