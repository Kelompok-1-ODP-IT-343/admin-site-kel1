"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { DeveloperDetail } from "@/components/data/developers"

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

  const levelColor =
    developer.partnership_level === "Platinum"
      ? "bg-blue-500 text-white"
      : developer.partnership_level === "Gold"
      ? "bg-yellow-400 text-black"
      : "bg-gray-400 text-white"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-tight mb-0 text-gray-900 dark:!text-white">
            Developer Details
          </DialogTitle>
        </DialogHeader>

      {/* Developer Summary */}
      <div className="rounded-xl border bg-muted/30 p-6 mt-2 flex flex-col items-center text-center gap-3">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-muted bg-white shadow-sm">
          <Image
            src={developer.logo || "/images/default-logo.png"}
            alt={developer.company_name}
            fill
            className="object-fill"
          />
        </div>

        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:!text-white">
            {developer.company_name}
          </h2>
          <Badge className={`${levelColor} mt-1`}>
            {developer.partnership_level}
          </Badge>
        </div>
      </div>

        {/* Description */}
        <div className="mt-4 rounded-xl border bg-card p-4">
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:!text-white">
            Description
            </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {developer.description}
          </p>
        </div>

        {/* Summary Table */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
            Developer Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Contact Person</span>
              <span className="font-medium">{developer.contact_person}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{developer.email}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{developer.phone}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Website</span>
              <a
                href={developer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {developer.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Established</span>
              <span className="font-medium">{developer.established_year}</span>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
            Address Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right">{developer.address}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">City</span>
              <span className="font-medium">{developer.city}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">Province</span>
              <span className="font-medium">{developer.province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Postal Code</span>
              <span className="font-medium">{developer.postal_code}</span>
            </div>
          </div>
        </div>



        <p className="mt-4 text-xs text-center text-muted-foreground">
          Informasi developer bersifat rahasia dan mengikuti kebijakan kerja sama BNI KPR.
        </p>
      </DialogContent>
    </Dialog>
  )
}
