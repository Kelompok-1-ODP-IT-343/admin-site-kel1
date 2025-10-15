"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { DeveloperDetail } from "@/components/data/developers"
import { Badge } from "@/components/ui/badge"

export default function ViewDeveloperDialog({
  open,
  onOpenChange,
  developer,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  developer: DeveloperDetail | null
}) {
  if (!developer) return null

  const statusColor =
    developer.partnershipStatus === "Active"
      ? "default"
      : developer.partnershipStatus === "Pending"
      ? "secondary"
      : "destructive"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Developer Information
          </DialogTitle>
          <DialogDescription className="text-center">
            Rincian lengkap data developer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 mt-4">
          <Image
            src={developer.logo || "/images/default-logo.png"}
            alt={developer.name}
            width={100}
            height={100}
            className="rounded-full object-cover border shadow-md bg-white"
          />
          <div className="text-center">
            <h2 className="text-lg font-semibold">{developer.name}</h2>
            <Badge variant={statusColor} className="mt-1">
              {developer.partnershipStatus}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Email:</span> {developer.email}</p>
          <p><span className="font-semibold">Phone:</span> {developer.phone}</p>
          <p><span className="font-semibold">Address:</span> {developer.address}</p>
          <p><span className="font-semibold">Established:</span> {developer.established}</p>
          <p><span className="font-semibold">Total Projects:</span> {developer.totalProjects}</p>
          <p><span className="font-semibold">Status:</span> {developer.partnershipStatus}</p>
          <p><span className="font-semibold">Developer ID:</span> {developer.id}</p>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Informasi developer bersifat rahasia dan mengikuti kebijakan kerja sama BNI KPR.
        </div>
      </DialogContent>
    </Dialog>
  )
}
