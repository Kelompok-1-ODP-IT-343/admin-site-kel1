"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-0">
          <DialogTitle className="text-lg font-semibold leading-tight mb-0 text-gray-900 dark:!text-white">
            Customer Information
          </DialogTitle>
        </DialogHeader>


        {/* --- Grid 2 kolom: kiri profil, kanan pekerjaan --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* ---------- KIRI: DATA PROFIL ---------- */}
          <div className="border rounded-xl p-4 bg-card shadow-sm">
            <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
              Data Profil
            </h3>
            <div></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Nama Lengkap</span>
                <span className="font-medium text-right">{customer.name}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium text-right">{customer.username}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-right">{customer.email}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Telepon</span>
                <span className="font-medium text-right">{customer.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">NIK</span>
                <span className="font-medium text-right">{customer.nik}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">NPWP</span>
                <span className="font-medium text-right">{customer.npwp}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Tempat/Tgl Lahir</span>
                <span className="font-medium text-right">
                  {customer.birth_place}, {customer.birth_date}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Jenis Kelamin</span>
                <span className="font-medium text-right">{customer.gender}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-right">{customer.marital_status}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Alamat</span>
                <span className="font-medium text-right w-[55%] text-right">
                  {customer.address}, {customer.sub_district}, {customer.district}, {customer.city}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Provinsi</span>
                <span className="font-medium text-right">{customer.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kode Pos</span>
                <span className="font-medium text-right">{customer.postal_code}</span>
              </div>
            </div>
          </div>

          {/* ---------- KANAN: DATA PEKERJAAN ---------- */}
          <div className="border rounded-xl p-4 bg-card shadow-sm">
            <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
              Data Pekerjaan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Pekerjaan</span>
                <span className="font-medium text-right">{customer.occupation}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Pendapatan Bulanan</span>
                <span className="font-medium text-right">Rp {customer.monthly_income}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Nama Perusahaan</span>
                <span className="font-medium text-right">{customer.company_name}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Alamat Perusahaan</span>
                <span className="font-medium text-right w-[55%] text-right">
                  {customer.company_address}, {customer.company_subdistrict}, {customer.company_district}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Kota</span>
                <span className="font-medium text-right">{customer.company_city}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">Provinsi</span>
                <span className="font-medium text-right">{customer.company_province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kode Pos</span>
                <span className="font-medium text-right">{customer.company_postal_code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer info --- */}
        <div className="mt-6 text-xs text-muted-foreground text-center">
          Data nasabah bersifat rahasia dan dilindungi oleh kebijakan privasi BNI.
        </div>
      </DialogContent>
    </Dialog>
  )
}
