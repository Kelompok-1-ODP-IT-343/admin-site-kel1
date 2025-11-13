//edit masih di console log

"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Property, updateProperty, filterEditableFields } from "@/services/properties";
import { fetchDevelopers, getDeveloperById } from "@/services/developers";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


export default function ViewPropertyDialog({
  open,
  onOpenChange,
  property,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onUpdated?: (updated?: any) => void;
}) {
  if (!property) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({ ...property });
  const [developers, setDevelopers] = useState<Array<{ id: number; company_name: string }>>([]);
  const gallery: string[] = (() => {
    const normalize = (v: any): string | null => {
      if (typeof v === "string") {
        const s = v.trim();
        return s.length > 0 ? s : null;
      }
      if (v && typeof v === "object") {
        const candidate = v.url || v.src || v.path || v.imageUrl || v.image_url;
        if (typeof candidate === "string") {
          const s = candidate.trim();
          return s.length > 0 ? s : null;
        }
      }
      return null;
    };

    const src: any = editedData as any;
    const raw = Array.isArray(src.images)
      ? src.images
      : Array.isArray(src.imageUrls)
      ? src.imageUrls
      : Array.isArray(src.image_urls)
      ? src.image_urls
      : null;

    if (raw) {
      return raw
        .map(normalize)
        .filter((u: string | null): u is string => typeof u === "string");
    }

    const single = src.imageUrl || src.image_url || "";
    if (typeof single === "string") {
      if (single.includes(",")) {
        return single
          .split(",")
          .map((s) => normalize(s))
          .filter((u: string | null): u is string => typeof u === "string");
      }
      const s = normalize(single);
      return s ? [s] : [];
    }
    return [];
  })();

  // Fetch developer list for dropdown
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchDevelopers();
        // Normalisasi minimal ke {id, company_name}
        const normalized = Array.isArray(list)
          ? list.map((d: any) => ({ id: Number(d.id), company_name: String(d.company_name || d.name || d.companyName || "-") }))
          : [];
        setDevelopers(normalized);
      } catch (e) {
        console.error("❌ Gagal memuat developers:", e);
        setDevelopers([]);
      }
    })();
  }, []);

  // Saat dialog dibuka untuk properti tertentu, pastikan kita tahu developer yang aktif
  useEffect(() => {
    (async () => {
      try {
        const devId = (editedData as any).developerId || (editedData as any).developer_id;
        if (devId) {
          const res = await getDeveloperById(devId);
          const data = res?.data || res; // beberapa endpoint bisa bungkus dalam {data}
          const devName = data?.companyName || data?.company_name || (editedData as any).developer_name;
          setEditedData((prev: any) => ({
            ...prev,
            developerId: Number(data?.id ?? devId),
            developerName: devName,
            developer_name: devName,
          }));
        }
      } catch (e) {
        console.error("❌ Gagal mengambil developer aktif:", e);
      }
    })();
    // jalankan ulang bila property berubah
  }, [property?.id]);

  const handleChange = (field: string, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = filterEditableFields(editedData)
      const result = await updateProperty(editedData.id, payload)
      console.log("📤 PUT PAYLOAD:", payload);

      if (result?.success) {
        toast.success("✅ Data properti berhasil diperbarui");
        setIsEditing(false);
        // Kirim entity updated ke parent untuk optimistic update
        const updatedEntity = result?.data ?? {
          id: editedData.id,
          developerId: (payload as any).developerId ?? editedData.developerId,
          developerName: (payload as any).developerName ?? editedData.developerName ?? editedData.developer_name,
        };
        onUpdated?.(updatedEntity);
      } else {
        toast.error(result?.message || "Gagal update property");
      }
    } catch (err) {
      console.error("❌ Error saat update:", err);
      toast.error("Terjadi kesalahan saat update property");
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1500] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold leading-tight mb-0 text-gray-900 dark:!text-white flex justify-between items-center">
            Property Overview
          </DialogTitle>
        </DialogHeader>

        {/* === MAIN CONTENT === */}
        <div className="overflow-y-auto pr-2 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ---------- LEFT: IMAGE & SUMMARY ---------- */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const url = gallery[idx];
                  return url ? (
                    <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border">
                      <Image src={url} alt={`${editedData.title} ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border border-dashed grid place-items-center text-muted-foreground">
                      <Plus className="w-6 h-6" />
                    </div>
                  );
                })}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editedData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="text-lg font-semibold"
                    />
                    <Input
                      value={editedData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="text-sm"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-lg text-gray-900 dark:!text-white">
                      {editedData.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{editedData.description}</p>
                  </>
                )}
              </div>

              {/* Info Ringkas */}
              <div className="rounded-lg border bg-muted/30 p-4 text-sm grid grid-cols-2 gap-y-2">
                {[
                  ["Developer", "developer_name"],
                  ["Tipe", "property_type"],
                  ["Harga", "price"],
                  ["Harga/m²", "price_per_sqm"],
                  ["Lokasi", "city"],
                  ["Alamat", "address"],

                ].map(([label, key]) => (
                  <div key={key} className="flex justify-between items-center gap-3">
                    <strong className="min-w-[110px]">{label}:</strong>
                    {isEditing ? (
                      key === "developer_name" ? (
                        <span className="text-right w-[55%] truncate font-medium text-gray-800 dark:text-gray-100">
                          {editedData.developer_name || "-"}
                        </span>
                      ) : key === "property_type" ? (
                        <Select
                          value={(editedData as any).property_type ? String((editedData as any).property_type) : undefined}
                          onValueChange={(val) => handleChange("property_type", val)}
                        >
                          <SelectTrigger className="h-7 text-sm max-w-[180px] sm:max-w-[140px]">
                            <SelectValue placeholder="Pilih tipe" />
                          </SelectTrigger>
                          <SelectContent position="popper" align="end">
                            <SelectItem value="rumah">Rumah</SelectItem>
                            <SelectItem value="apartemen">Apartemen</SelectItem>
                            <SelectItem value="ruko">Ruko</SelectItem>
                            <SelectItem value="tanah">Tanah</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={(editedData as any)[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="h-7 text-sm max-w-[180px] sm:max-w-[140px]"
                        />
                      )
                    ) : (
                      <span className="text-right w-[55%] truncate">
                        {key.includes("price")
                          ? `Rp${(editedData as any)[key].toLocaleString("id-ID")}`
                          : (editedData as any)[key]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- RIGHT: DETAIL & LOCATION ---------- */}
            <div className="flex flex-col gap-4">
              {/* Property Details */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h3 className="font-semibold text-base text-gray-900 dark:!text-white">
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ["Luas Tanah (m²)", "land_area", "m²"],
                    ["Luas Bangunan (m²)", "building_area", "m²"],
                    ["Kamar Tidur", "bedrooms", ""],
                    ["Kamar Mandi", "bathrooms", ""],
                    ["Lantai", "floors", ""],
                    ["Garasi", "garage", ""],
                    ["Tahun Bangun", "year_built", ""],
                    ["Sertifikat", "certificate_type", ""],
                    ["Biaya Pemeliharaan", "maintenance_fee", "Rp"],
                    ["Nilai PBB", "pbb_value", "Rp"],
                    ["Koordinat", "latitude_longitude", ""],
                    ["Kode Pos", "postal_code", ""],
                  ].map(([label, key, unit]) => {
                    const value =
                      key === "latitude_longitude"
                        ? `${(editedData as any).latitude}, ${(editedData as any).longitude}`
                        : (editedData as any)[key];

                    const displayValue =
                      key === "maintenance_fee" || key === "pbb_value"
                        ? `Rp${(Number(value) || 0).toLocaleString("id-ID")}`
                        : key === "latitude_longitude"
                        ? value
                        : unit === "m²"
                        ? `${value} ${unit}`
                        : value;

                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center gap-3"
                      >
                        <strong className="min-w-[120px]">{label}:</strong>
                        {isEditing ? (
                          key === "latitude_longitude" ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={(editedData as any).latitude}
                                onChange={(e) => handleChange("latitude", e.target.value)}
                                className="h-7 text-sm w-[80px]"
                                placeholder="Lat"
                              />
                              <Input
                                value={(editedData as any).longitude}
                                onChange={(e) => handleChange("longitude", e.target.value)}
                                className="h-7 text-sm w-[80px]"
                                placeholder="Long"
                              />
                            </div>
                          ) : key === "certificate_type" ? (
                            <Select
                              value={(editedData as any).certificate_type ? String((editedData as any).certificate_type) : undefined}
                              onValueChange={(val) => handleChange("certificate_type", val)}
                            >
                              <SelectTrigger className="h-7 text-sm max-w-[140px]">
                                <SelectValue placeholder="Pilih sertifikat" />
                              </SelectTrigger>
                              <SelectContent position="popper" align="end">
                                <SelectItem value="SHM">SHM</SelectItem>
                                <SelectItem value="HGB">HGB</SelectItem>
                                <SelectItem value="HGU">HGU</SelectItem>
                                <SelectItem value="HP">HP</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-1">
                              {unit === "Rp" && <span className="text-gray-500 text-xs">Rp</span>}
                              <Input
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="h-7 text-sm max-w-[140px]"
                              />
                              {unit === "m²" && <span className="text-gray-500 text-xs">m²</span>}
                            </div>
                          )
                        ) : (
                          <span className="text-right truncate max-w-[180px]">{displayValue}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Location Details */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h3 className="font-semibold text-base text-gray-900 dark:!text-white">
                  Location Details
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ["Alamat", "address"],
                    ["Kelurahan", "sub_district"],
                    ["Kecamatan", "district"],
                    ["Kota", "city"],
                    ["Provinsi", "province"],
                    ["Kode Pos", "postal_code"],
                  ].map(([label, key]) => (
                    <div key={key} className="flex justify-between items-center gap-3">
                      <strong className="min-w-[120px]">{label}:</strong>
                      {isEditing ? (
                        <Input
                          value={(editedData as any)[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="h-7 text-sm max-w-[180px] sm:max-w-[140px]"
                        />
                      ) : (
                        <span className="text-right truncate max-w-[180px]">
                          {(editedData as any)[key]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === FOOTER BUTTONS === */}
        <div className="flex justify-end gap-2 mt-4">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
        Cancel
      </Button>
    </>
  )}
</div>


        <div className="mt-6 text-xs text-muted-foreground text-center">
          Data properti dilindungi oleh kebijakan privasi dan peraturan BNI.
        </div>
      </DialogContent>
    </Dialog>
  );
}
