"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { dummyPayments } from "@/components/data/payments"

export default function PaymentDetailsDialog({
  open,
  onOpenChange,
  customerId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string | null
}) {
  const payment = dummyPayments.find((p) => p.id === customerId)
  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Payment Details
          </DialogTitle>
          <DialogDescription className="text-center">
            Rincian pembayaran KPR pelanggan.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Customer:</p>
            <span>{payment.customerName}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Bank:</p>
            <span>{payment.bank}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Loan Amount:</p>
            <span>{payment.loanAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Tenor:</p>
            <span>{payment.tenor}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Rate Type:</p>
            <span>{payment.rateType}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Installment / Month:</p>
            <span>{payment.monthlyInstallment}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Next Payment:</p>
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {payment.nextPayment}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Due Date:</p>
            <span>{payment.dueDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Last Status:</p>
            <Badge
              variant={
                payment.lastPaymentStatus.includes("Pending")
                  ? "secondary"
                  : payment.lastPaymentStatus.includes("Late")
                  ? "destructive"
                  : "default"
              }
            >
              {payment.lastPaymentStatus}
            </Badge>
          </div>
        </div>

        <div className="mt-5 border-t pt-3 text-xs text-center text-muted-foreground">
          Transaksi KPR ini mengikuti ketentuan POJK 11/2022 dan BI Rate terkini.
        </div>
      </DialogContent>
    </Dialog>
  )
}
