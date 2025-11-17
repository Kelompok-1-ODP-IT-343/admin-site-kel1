//edit masih di console log

"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Property, updateProperty, filterEditableFields, getPropertyDetail, deletePropertyImageLinks, uploadPropertyImage } from "@/services/properties";
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
  const [broken, setBroken] = useState<boolean[]>([]);
  const [deleting, setDeleting] = useState<Record<number, boolean>>({});
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [confirmImageOpen, setConfirmImageOpen] = useState(false);
  const [deleteImageTarget, setDeleteImageTarget] = useState<{ url: string; idx: number } | null>(null);
  const [localImages, setLocalImages] = useState<Record<number, { file: File; preview: string }>>({});
  const gallery: string[] = (() => {
    const sanitize = (s: string) => s.replace(/^['"`\s]+|['"`\s]+$/g, "");
    const normalize = (v: any): string | null => {
      if (typeof v === "string") {
        const s = sanitize(v.trim());
        return s.length > 0 ? s : null;
      }
      if (v && typeof v === "object") {
        const candidate = v.url || v.src || v.path || v.imageUrl || v.image_url;
        if (typeof candidate === "string") {
          const s = sanitize(candidate.trim());
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

  useEffect(() => {
    setBroken(Array(Math.max(gallery.length, 4)).fill(false));
  }, [gallery.length]);

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
        // Ambil detail properti penuh agar field seperti images terisi
        const detailId = property?.id
        if (detailId) {
          const detail = await getPropertyDetail(detailId)
          const full = detail?.data || property
          if (full) setEditedData(full as any)
        }
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

  useEffect(() => {
    (async () => {
      if (!open || !property?.id) return
      const detail = await getPropertyDetail(property.id)
      const full: any = detail?.data || property
      if (full) {
        setEditedData((prev: any) => ({
          ...prev,
          ...full,
          developerId: Number(full?.developer?.id ?? full?.developer_id ?? prev?.developerId),
          developerName: full?.developer?.companyName ?? full?.developer_name ?? prev?.developerName,
          developer_name: full?.developer?.companyName ?? full?.developer_name ?? prev?.developer_name,
          property_type: full?.property_type ?? full?.propertyType ?? prev?.property_type,
        }))
      }
    })()
  }, [open, property?.id])

  const sanitizeInteger = (s: string) => s.replace(/\D/g, "");
  const sanitizeDecimalSigned = (s: string) => {
    let v = s.replace(/[^0-9.\-]/g, "");
    v = v.startsWith("-") ? "-" + v.slice(1).replace(/-/g, "") : v.replace(/-/g, "");
    const i = v.indexOf(".");
    if (i !== -1) {
      v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, "");
    }
    return v;
  };
  const integerFields = [
    "price",
    "price_per_sqm",
    "land_area",
    "building_area",
    "bedrooms",
    "bathrooms",
    "floors",
    "garage",
    "year_built",
    "maintenance_fee",
    "pbb_value",
    "postal_code",
  ];
  const coordFields = ["latitude", "longitude"];

  const handleChange = (field: string, value: string | number) => {
    let v = typeof value === "number" ? String(value) : String(value);
    if (integerFields.includes(field)) v = sanitizeInteger(v);
    if (coordFields.includes(field)) v = sanitizeDecimalSigned(v);
    setEditedData((prev) => ({ ...prev, [field]: v }));
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
    <>
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
                {Array.from({ length: Math.max(gallery.length, 4) }).map((_, idx) => {
                  const url = gallery[idx];
                  const showImage = !!url && !broken[idx];
                  return showImage ? (
                    <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={url}
                        alt={`${editedData.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={() =>
                          setBroken((prev) => {
                            const next = [...prev];
                            next[idx] = true;
                            return next;
                          })
                        }
                      />
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-7 px-2"
                          disabled={!!deleting[idx]}
                          onClick={() => {
                            setDeleteImageTarget({ url, idx })
                            setConfirmImageOpen(true)
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border border-dashed text-muted-foreground">
                      {isEditing ? (
                        localImages[idx] ? (
                          <>
                            <img src={localImages[idx].preview} alt="Preview" className="w-full h-full object-cover" />
                            {uploading[idx] && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2 flex gap-2">
                              <Button
                                size="sm"
                                className="h-7 px-2"
                                disabled={!!uploading[idx]}
                                onClick={async () => {
                                  const item = localImages[idx]
                                  if (!item) return
                                  try {
                                    setUploading((prev) => ({ ...prev, [idx]: true }))
                                    const pid = (editedData as any).id
                                    const res = await uploadPropertyImage(item.file, pid)
                                    if (res?.success) {
                                      let link: string | null = null
                                      const d: any = res.data
                                      if (Array.isArray(d)) link = typeof d[0] === "string" ? d[0] : null
                                      else if (typeof d === "string") link = d
                                      else if (Array.isArray(d?.data)) link = typeof d.data[0] === "string" ? d.data[0] : null
                                      else if (typeof d?.data === "string") link = d.data
                                      setEditedData((prev: any) => {
                                        const next: any = { ...prev }
                                        const key = Array.isArray(next.images)
                                          ? "images"
                                          : Array.isArray(next.imageUrls)
                                          ? "imageUrls"
                                          : Array.isArray(next.image_urls)
                                          ? "image_urls"
                                          : "images"
                                        if (!Array.isArray(next[key])) next[key] = []
                                        if (link) next[key] = [...next[key], link]
                                        return next
                                      })
                                      setLocalImages((prev) => {
                                        const next = { ...prev }
                                        delete next[idx]
                                        return next
                                      })
                                      toast.success("✅ Gambar berhasil di-upload!")
                                    } else {
                                      toast.error(res?.message || "❌ Upload gagal")
                                    }
                                  } catch (err: any) {
                                    toast.error(err?.message || "Terjadi kesalahan saat upload")
                                  } finally {
                                    setUploading((prev) => ({ ...prev, [idx]: false }))
                                  }
                                }}
                              >
                                Upload
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 px-2"
                                disabled={!!uploading[idx]}
                                onClick={() => {
                                  setLocalImages((prev) => {
                                    const next = { ...prev }
                                    delete next[idx]
                                    return next
                                  })
                                }}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              id={`dialog-image-slot-${idx}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                if (!file.type.startsWith("image/")) { toast.error("File harus gambar"); e.currentTarget.value = ""; return }
                                if (file.size > 20 * 1024 * 1024) { toast.error("Ukuran maksimum 20MB per gambar"); e.currentTarget.value = ""; return }
                                const preview = URL.createObjectURL(file)
                                setLocalImages((prev) => ({ ...prev, [idx]: { file, preview } }))
                              }}
                            />
                            <label htmlFor={`dialog-image-slot-${idx}`} className="absolute inset-0 cursor-pointer grid place-items-center">
                              <Plus className="w-10 h-10" />
                            </label>
                          </>
                        )
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <Plus className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>




            </div>

            {/* ---------- RIGHT: DETAIL & LOCATION ---------- */}
            <div className="flex flex-col gap-4">
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
                          value={(function(){
                            const raw = (editedData as any).property_type ?? (editedData as any).propertyType
                            return raw ? String(raw).toLowerCase() : undefined
                          })()}
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
                          inputMode={key === "price" || key === "price_per_sqm" ? "numeric" : undefined}
                          pattern={key === "price" || key === "price_per_sqm" ? "[0-9]*" : undefined}
                          className="h-7 text-sm max-w-[180px] sm:max-w-[140px]"
                        />
                      )
                    ) : (
                      (() => {
                        if (key === "developer_name") {
                          const name = (editedData as any).developer_name
                            || (editedData as any).developerName
                            || (editedData as any)?.developer?.companyName
                            || "-"
                          return <span className="text-right w-[55%] truncate font-medium">{name}</span>
                        }
                        const raw = (editedData as any)[key]
                        const isPrice = key.includes("price")
                        const formatted = isPrice
                          ? `Rp${Number(raw ?? 0).toLocaleString("id-ID")}`
                          : raw ?? "-"
                        return <span className="text-right w-[55%] truncate">{formatted}</span>
                      })()
                    )}
                  </div>
                ))}
              </div>
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
                                inputMode="decimal"
                                pattern="^-?\\d*\\.?\\d*$"
                                className="h-7 text-sm w-[80px]"
                                placeholder="Lat"
                              />
                              <Input
                                value={(editedData as any).longitude}
                                onChange={(e) => handleChange("longitude", e.target.value)}
                                inputMode="decimal"
                                pattern="^-?\\d*\\.?\\d*$"
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
                                inputMode={["land_area","building_area","bedrooms","bathrooms","floors","garage","year_built","maintenance_fee","pbb_value","postal_code"].includes(key as string) ? "numeric" : undefined}
                                pattern={["land_area","building_area","bedrooms","bathrooms","floors","garage","year_built","maintenance_fee","pbb_value","postal_code"].includes(key as string) ? "[0-9]*" : undefined}
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
                      {(() => {
                        const val =
                          key === "sub_district"
                            ? (editedData as any).sub_district ?? (editedData as any).village
                            : (editedData as any)[key]
                        return isEditing ? (
                          <Input
                            value={val ?? ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            inputMode={key === "postal_code" ? "numeric" : undefined}
                            pattern={key === "postal_code" ? "[0-9]*" : undefined}
                            className="h-7 text-sm max-w-[180px] sm:max-w-[140px]"
                          />
                        ) : (
                          <span className="text-right truncate max-w-[180px]">{val ?? "-"}</span>
                        )
                      })()}
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
    <Dialog open={confirmImageOpen} onOpenChange={setConfirmImageOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Gambar</DialogTitle>
          <DialogDescription>Gambar akan dihapus dari properti ini.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setConfirmImageOpen(false)
              setDeleteImageTarget(null)
            }}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!deleteImageTarget) return
              const { url, idx } = deleteImageTarget
              try {
                setDeleting((prev) => ({ ...prev, [idx]: true }))
                const pid = (editedData as any).id
                const res = await deletePropertyImageLinks([url], pid)
                if (res?.success) {
                  setEditedData((prev: any) => {
                    const next: any = { ...prev }
                    if (Array.isArray(next.images)) next.images = next.images.filter((u: any) => String(u) !== url)
                    else if (Array.isArray(next.imageUrls)) next.imageUrls = next.imageUrls.filter((u: any) => String(u) !== url)
                    else if (Array.isArray(next.image_urls)) next.image_urls = next.image_urls.filter((u: any) => String(u) !== url)
                    else if (typeof next.imageUrl === "string") {
                      const arr = next.imageUrl.split(",").map((s: string) => s.trim()).filter(Boolean)
                      next.imageUrl = arr.filter((u: string) => u !== url).join(",")
                    }
                    return next
                  })
                  toast.success("Gambar dihapus")
                } else {
                  toast.error(res?.message || "Gagal menghapus gambar")
                }
              } catch (e: any) {
                toast.error(e?.message || "Terjadi kesalahan")
              } finally {
                setDeleting((prev) => ({ ...prev, [idx]: false }))
                setConfirmImageOpen(false)
                setDeleteImageTarget(null)
              }
            }}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
