"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Property } from "@/components/data/properties"

export default function ViewPropertyDialog({
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
      <DialogContent className="sm:max-w-[1396px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold leading-tight mb-0 text-gray-900 dark:!text-white">
            Property Overview</DialogTitle>
        </DialogHeader>

        {/* Konten Scrollable */}
        <div className="overflow-y-auto pr-2 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KIRI: Gambar + Summary */}
            <div className="space-y-4">
              {/* Gambar */}
              <div className="relative w-full h-56 rounded-lg overflow-hidden border">
                <Image
                  src={property.image_url}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info Utama */}
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:!text-white">
                  {property.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{property.description}</p>
              </div>

              {/* Info Ringkas */}
              <div className="rounded-lg border bg-muted/30 p-4 text-sm grid grid-cols-2 gap-y-2">
                <div><strong>Developer:</strong> {property.company_name}</div>
                <div><strong>Tipe:</strong> {property.property_type}</div>
                <div><strong>Harga:</strong> Rp {property.price.toLocaleString("id-ID")}</div>
                <div><strong>Harga/m²:</strong> Rp {property.price_per_sqm.toLocaleString("id-ID")}</div>
                <div><strong>Lokasi:</strong> {property.city}, {property.province}</div>
                <div><strong>Alamat:</strong> {property.address}</div>
              </div>
            </div>

            {/* KANAN: Detail dan Lokasi */}
            <div className="flex flex-col gap-4">
              {/* Card Property Details */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h3 className="font-semibold text-base text-gray-900 dark:!text-white">
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div><strong>Luas Tanah:</strong> {property.land_area} m²</div>
                  <div><strong>Luas Bangunan:</strong> {property.building_area} m²</div>
                  <div><strong>Kamar Tidur:</strong> {property.bedrooms}</div>
                  <div><strong>Kamar Mandi:</strong> {property.bathrooms}</div>
                  <div><strong>Lantai:</strong> {property.floors}</div>
                  <div><strong>Garasi:</strong> {property.garage}</div>
                  <div><strong>Tahun Bangun:</strong> {property.year_built}</div>
                  <div><strong>Sertifikat:</strong> {property.certificate_type}</div>
                  <div><strong>Biaya Pemeliharaan:</strong> Rp {property.maintenance_fee.toLocaleString("id-ID")}</div>
                  <div><strong>Nilai PBB:</strong> Rp {property.pbb_value.toLocaleString("id-ID")}</div>
                  <div><strong>Koordinat:</strong> {property.latitude}, {property.longitude}</div>
                  <div><strong>Kode Pos:</strong> {property.postal_code}</div>
                </div>
              </div>

              {/* Card Location Details */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h3 className="font-semibold text-base text-gray-900 dark:!text-white">
                  Location Details
                  </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div><strong>Alamat:</strong> {property.address}</div>
                  <div><strong>Kelurahan:</strong> {property.sub_district}</div>
                  <div><strong>Kecamatan:</strong> {property.district}</div>
                  <div><strong>Kota:</strong> {property.city}</div>
                  <div><strong>Provinsi:</strong> {property.province}</div>
                  <div><strong>Kode Pos:</strong> {property.postal_code}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
