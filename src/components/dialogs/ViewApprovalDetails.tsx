"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import coreApi from "@/lib/coreApi"
import { getPengajuanDetail } from "@/services/approvekpr"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export type HistoryRow = {
  id: string
  application_id: string
  customer_name: string
  property_name: string
  address: string
  price: number
    status:
    | "PROPERTY_APPRAISAL"
    | "CREDIT_ANALYSIS"
    | "FINAL_APPROVAL"
    | "ACCEPTED"
    | "REJECTED"
    | string // fallback biar gak error kalau ada status baru
  approval_date: string
}

export default function ViewApprovalDetails({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: HistoryRow | null
}) {
  if (!data) return null
  type ApprovalWorkflow = {
    stage: string
    assignedToName: string
    assignedToEmail: string
    status: "PENDING" | "APPROVED" | "REJECTED" | string
    approvalNotes?: string | null
    rejectionReason?: string | null
  }

  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !data?.id) return

    let ignore = false
    const fetchWorkflow = async () => {
      setLoading(true)
      setError(null)
      try {
        const applicationId = Number(data.id)
        if (!Number.isFinite(applicationId)) {
          throw new Error(`Invalid application id: ${data.id}`)
        }

        // Gunakan service standar yang sudah dipakai di project
        const payload = await getPengajuanDetail(applicationId)
        const wf: ApprovalWorkflow[] = Array.isArray(payload?.approvalWorkflows)
          ? payload.approvalWorkflows
          : []
        if (!ignore) setWorkflows(wf)
      } catch (err: any) {
        console.error("❌ Error fetching approval workflow:", err?.response?.data || err)
        const msg = err?.response?.data?.message || err?.message || "Gagal memuat workflow approval."
        if (!ignore) setError(msg)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchWorkflow()
    return () => {
      ignore = true
    }
  }, [open, data?.id])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const d = new Date(dateString)
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const stageMap: Record<string, string> = {
    PROPERTY_APPRAISAL: "Property Appraisal",
    CREDIT_ANALYSIS: "Credit Analysis",
    FINAL_APPROVAL: "Final Approval",
  }

  const formatStage = (stage: string) => stageMap[stage] || (stage || "-").replace(/_/g, " ")

  const statusLabel = (s: string) => {
    const t = (s || "-").toUpperCase()
    if (t === "PENDING") return "Pending"
    if (t === "APPROVED") return "Approved"
    if (t === "REJECTED") return "Rejected"
    return s
  }

  const getBadgeStyle = (s: string): React.CSSProperties => {
    const t = (s || "").toUpperCase()
    if (t === "PENDING") return { backgroundColor: "#FFF4E5", color: "#C2410C" }
    if (t === "APPROVED") return { backgroundColor: "#E6F6E6", color: "#15803D" }
    if (t === "REJECTED") return { backgroundColor: "#FEE2E2", color: "#991B1B" }
    return { backgroundColor: "#E5E7EB", color: "#1F2937" }
  }

  const getNotesContainerStyle = (s: string): React.CSSProperties => {
    const t = (s || "").toUpperCase()
    if (t === "APPROVED") return { backgroundColor: "#E6F6E6", borderColor: "#15803D" }
    if (t === "REJECTED") return { backgroundColor: "#FEE2E2", borderColor: "#991B1B" }
    return { backgroundColor: "#E5E7EB", borderColor: "#9CA3AF" }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] md:max-h-[80vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#1F2937] dark:!text-white">
            Approval Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm mt-3">
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">ID Pengajuan</span>
            <span className="font-medium">{data.application_id}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Nama Customer</span>
            <span className="font-medium">{data.customer_name}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Nama Properti</span>
            <span className="font-medium">{data.property_name}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Alamat</span>
            <span className="font-medium text-right w-[55%]">{data.address}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Harga</span>
            <span className="font-medium">
              {data.price > 0 ? `Rp ${data.price.toLocaleString("id-ID")}` : "-"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-muted-foreground">Tanggal Keputusan</span>
            <span className="font-medium">{formatDate(data.approval_date)}</span>
          </div>
        </div>

        {/* Timeline Approval */}
        <div className="mt-5 flex-1 min-h-0">
          <div className="text-sm font-semibold text-[#1F2937] mb-2">Approval Workflow</div>

          {/* Scroll khusus area workflow */}
          <div className="max-h-[280px] overflow-y-auto rounded-md border bg-white/50 pr-2">

            {loading ? (
              <div className="text-sm text-muted-foreground">Memuat workflow approval...</div>
            ) : error ? (
              <div className="text-sm text-red-700">{error}</div>
            ) : workflows.length === 0 ? (
              <div className="text-sm text-muted-foreground">Tidak ada data workflow.</div>
            ) : (
              <div className="relative pl-6 border-l-2" style={{ borderLeftColor: "#FF8500" }}>
                <AnimatePresence>
                  {workflows.map((step, idx) => (
                    <motion.div
                      key={`${step.stage}-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="relative mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:bg-accent/5"
                    >
                      <span
                        className="absolute -left-[9px] top-5 h-3 w-3 rounded-full"
                        style={{ backgroundColor: "#FF8500" }}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-base font-semibold tracking-tight text-[#1F2937]">
                            {formatStage(step.stage)}
                          </div>
                          <div className="text-sm text-gray-700">{step.assignedToName || "-"}</div>
                          <div className="text-xs text-gray-500">{step.assignedToEmail || "-"}</div>
                        </div>
                        <Badge
                          className="px-2 py-1 text-xs font-semibold"
                          style={getBadgeStyle(step.status)}
                        >
                          {statusLabel(step.status)}
                        </Badge>
                      </div>
                      {(["APPROVED", "REJECTED"].includes((step.status || "").toUpperCase())) && (
                        <div
                          className="mt-3 rounded-lg border p-3"
                          style={getNotesContainerStyle(step.status)}
                        >
                          <div className="text-xs font-semibold text-gray-600">Catatan</div>
                          <div className="text-sm text-gray-800 break-words">
                            {(() => {
                              const t = (step.status || "").toUpperCase();
                              const content = t === "REJECTED" ? (step.rejectionReason ?? step.approvalNotes) : step.approvalNotes;
                              return content && String(content).trim() ? String(content) : "-";
                            })()}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>


      </DialogContent>
    </Dialog>
  )
}
