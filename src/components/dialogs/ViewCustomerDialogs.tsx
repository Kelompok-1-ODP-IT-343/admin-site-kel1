"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { Customer } from "@/components/data/customers"

export default function ViewCustomerDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Customer Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Informasi lengkap pelanggan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 mt-4">
          <Image
            src={customer.avatar || "/images/default-avatar.png"}
            alt={customer.name}
            width={100}
            height={100}
            className="rounded-full object-cover border shadow-md"
          />
          <div className="text-center">
            <h2 className="text-lg font-semibold">{customer.name}</h2>
            <p className="text-sm text-muted-foreground">{customer.job}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Email:</span> {customer.email}</p>
          <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
          <p><span className="font-semibold">Address:</span> {customer.address}</p>
          <p><span className="font-semibold">Joined:</span> {customer.joinedAt}</p>
          <p><span className="font-semibold">Status:</span> {customer.status}</p>
          <p><span className="font-semibold">Customer ID:</span> {customer.id}</p>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Data pelanggan bersifat rahasia dan mengikuti kebijakan privasi BNI.
        </div>
      </DialogContent>
    </Dialog>
  )
}
