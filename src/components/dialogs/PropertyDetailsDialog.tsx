"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type Property = {
  id: string
  namaProperti: string
  developer: string
  alamat: string
  harga: number
  luasTanah: number
  luasBangunan: number
  kamarTidur: number
  kamarMandi: number
  kondisi: string
  tahunBangun: string
  imageUrl: string
}

export default function PropertyDetailsDialog({
  open,
  onOpenChange,
  property,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property | null
}) {
  if (!property) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{property.namaProperti}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <img
            src={property.imageUrl}
            alt={property.namaProperti}
            loading="lazy"
            className="rounded-xl w-full object-cover h-56 border"
          />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Developer:</strong> {property.developer}</p>
              <p><strong>Alamat:</strong> {property.alamat}</p>
              <p><strong>Harga:</strong> Rp {property.harga.toLocaleString("id-ID")}</p>
              <p><strong>Kondisi:</strong> {property.kondisi}</p>
            </div>
            <div>
              <p><strong>Luas Tanah:</strong> {property.luasTanah} m²</p>
              <p><strong>Luas Bangunan:</strong> {property.luasBangunan} m²</p>
              <p><strong>Kamar Tidur:</strong> {property.kamarTidur}</p>
              <p><strong>Kamar Mandi:</strong> {property.kamarMandi}</p>
              <p><strong>Tahun Bangun:</strong> {property.tahunBangun}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
