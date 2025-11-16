"use client"

import { createProperty, uploadPropertyImage } from "@/services/properties";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { IconFolder } from "@tabler/icons-react"
import { fetchDevelopers } from "@/services/developers"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Home, Wallet, Ruler, ImageIcon, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AddProperties() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadDevelopers() {
      const list = await fetchDevelopers()
      setDevelopers(list)
    }

    loadDevelopers()
  }, [])


  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1)
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [imageSlots, setImageSlots] = useState(
    Array.from({ length: 4 }, () => ({ file: null as File | null, preview: null as string | null, uploadedUrl: null as string | null, uploading: false }))
  )
  const handleSubmit = async () => {
    if (!propertyId) {
      toast.error("❌ Properti belum dibuat. Selesaikan Step 3 dulu.")
      return
    }
    const pending = imageSlots
      .map((s, i) => ({...s, index: i}))
      .filter((s) => s.file && !s.uploadedUrl) as { file: File; preview: string | null; uploadedUrl: string | null; uploading: boolean; index: number }[]
    if (pending.length > 0) {
      setImageSlots((prev) => prev.map((s, i) => {
        const p = pending.find((x) => x.index === i)
        return p ? { ...s, uploading: true } : s
      }))
      const results = await Promise.all(pending.map(async (p) => uploadPropertyImage(p.file, propertyId)))
      let anyFail = false
      setImageSlots((prev) => prev.map((s, i) => {
        const idx = pending.findIndex((x) => x.index === i)
        if (idx >= 0) {
          const r = results[idx]
          if (!r.success) anyFail = true
          return { ...s, uploading: false, uploadedUrl: r.success ? (r.data as any) : s.uploadedUrl }
        }
        return s
      }))
      if (anyFail) {
        toast.error("❌ Sebagian gambar gagal di-upload")
        return
      }
    }
    toast.success("✅ Properti dan gambar tersimpan!")
    router.push("/dashboard")
  };
  const [developers, setDevelopers] = useState<{ id: string; companyName: string }[]>([]);

  // State sementara untuk data form
  const [formData, setFormData] = useState({
    title: "",
    developer: "",
    tipe: "",
    alamat: "",
    kota: "",
    provinsi: "",
    koordinat: "",
    hargaTotal: "",
    hargaTanah: "",
    hargaBangunan: "",
    latitude: "",
    longitude: "",
    dp: "",
    pbb:"",
    cicilan: "",
    biayaTambahan: "",
    luasTanah: "",
    luasBangunan: "",
    kamarTidur: "",
    kamarMandi: "",
    lantai: "",
    garasi: "",
    tahunBangun: "",
    kondisi: "",
    kecamatan: "",
    kelurahan: "",
    kodePos: "",
    biayaPemeliharaan: "",
    sertifikat: "",

  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const requiredFieldsByStep: Record<number, string[]> = {
    1: ["title", "developer", "tipe", "alamat", "kota", "provinsi", "kecamatan", "kelurahan", "kodePos"],
    2: ["hargaTotal", "hargaTanah", "sertifikat"],
    3: ["luasTanah", "luasBangunan", "kamarTidur", "kamarMandi", "lantai", "garasi", "tahunBangun"],
  };


  const validateStep = () => {
    const required = requiredFieldsByStep[step] || [];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.warning(`❌ Field "${field}" wajib diisi sebelum lanjut.`)
        return false;
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    if (step === 3) {
      setLoading(true);
      const payload = {
        propertyCode: `PROP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
        developerId: Number(formData.developer),
        propertyType: formData.tipe?.toUpperCase() || "RUMAH",
        listingType: "PRIMARY",
        title: formData.title,
        description: formData.biayaTambahan || "Properti baru yang siap huni.",
        address: formData.alamat,
        city: formData.kota,
        province: formData.provinsi,
        postalCode: formData.kodePos || "00000",
        district: formData.kecamatan,
        village: formData.kelurahan,
        latitude: parseFloat(formData.latitude) || -6.244,
        longitude: parseFloat(formData.longitude) || 106.829,
        landArea: parseFloat(formData.luasTanah) || 0,
        buildingArea: parseFloat(formData.luasBangunan) || 0,
        bedrooms: parseInt(formData.kamarTidur) || 0,
        bathrooms: parseInt(formData.kamarMandi) || 0,
        floors: parseInt(formData.lantai) || 1,
        garage: parseInt(formData.garasi) || 1,
        yearBuilt: parseInt(formData.tahunBangun) || 2024,
        price: parseFloat(formData.hargaTotal) || 0,
        pricePerSqm: parseFloat(formData.hargaTanah) || 0,
        maintenanceFee: parseFloat(formData.biayaPemeliharaan) || 0,
        certificateType: formData.sertifikat || "SHM",
        certificateNumber: `SHM-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999)}`,
        certificateArea: parseFloat(formData.luasTanah) || 0,
        pbbValue: parseFloat(formData.pbb) || 0,
        status: "AVAILABLE",
        availabilityDate: "2025-10-01",
        handoverDate: "2026-01-15",
        isFeatured: false,
        isKprEligible: true,
        minDownPaymentPercent: parseFloat(formData.dp) || 20.0,
        maxLoanTermYears: 20,
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
        metaTitle: `${formData.title} | ${formData.kota}`,
        metaDescription:
          formData.biayaTambahan ||
          `Properti di ${formData.kota} dengan harga ${formData.hargaTotal}`,
        keywords: "rumah, properti, BNI griya, satu atap",
        viewCount: 0,
        inquiryCount: 0,
        favoriteCount: 0,
      };
      const result = await createProperty(payload);
      setLoading(false);
      if (result.success) {
        const created = result.data
        const id = created?.id ?? created?.data?.id
        if (id) {
          setPropertyId(Number(id))
          toast.success("✅ Properti berhasil dibuat. Lanjut upload gambar.")
          setStep(4)
        } else {
          toast.error("❌ ID properti tidak ditemukan dari response.")
        }
      } else {
        toast.error(`❌ Gagal menyimpan properti: ${result.message}`)
      }
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const onSelectImage = async (index: number, file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("File harus gambar")
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ukuran maksimum 20MB per gambar")
      return
    }
    const preview = URL.createObjectURL(file)
    setImageSlots((prev) => prev.map((s, i) => (i === index ? { ...s, file, preview, uploading: true } : s)))
    if (!propertyId) {
      toast.error("❌ Properti belum dibuat. Selesaikan Step 3 dulu.")
      setImageSlots((prev) => prev.map((s, i) => (i === index ? { ...s, uploading: false } : s)))
      return
    }
    const result = await uploadPropertyImage(file, propertyId)
    setImageSlots((prev) => prev.map((s, i) => (i === index ? { ...s, uploading: false, uploadedUrl: result.success ? (result.data as any) : s.uploadedUrl } : s)))
    if (result.success) {
      toast.success("✅ Gambar berhasil di-upload!")
    } else {
      toast.error(`❌ Upload gagal: ${result.message}`)
    }
  }


return (
  <div className="max-w-3xl mx-auto mt-10 space-y-6">
    <Card className="shadow-sm border rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === 1 && (
            <>
              <Home className="w-5 h-5 text-orange-500" />
              <span>Informasi Dasar Properti</span>
            </>
          )}
          {step === 2 && (
            <>
              <Wallet className="w-5 h-5 text-green-500" />
              <span>Informasi Harga & Pembiayaan</span>
            </>
          )}
          {step === 3 && (
            <>
              <Ruler className="w-5 h-5 text-blue-500" />
              <span>Spesifikasi Fisik</span>
            </>
          )}
          {/* STEP 4 - UPLOAD GAMBAR */}
          {/* {step === 4 && (
            <Empty className="border border-dashed rounded-2xl p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="text-primary">
                  <IconFolder size={40} stroke={1.5} />
                </EmptyMedia>
                <EmptyTitle>Upload Gambar Properti</EmptyTitle>
                <EmptyDescription>
                  Tambahkan gambar properti baru untuk profil properti.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!selectedFile || loading}
                  onClick={async () => {
                    if (!selectedFile) return;
                    setLoading(true);
                    const result = await uploadPropertyImage(selectedFile);
                    setLoading(false);
                    if (result.success) {
                      toast.success("✅ Gambar berhasil di-upload!")
                      console.log("Image URL:", result.data)
                    } else {
                      toast.error(`❌ Upload gagal: ${result.message}`)
                    }
                  }}
                >
                  {loading ? "Mengunggah..." : "Upload File"}
                </Button>
              </EmptyContent>
            </Empty>
          )} */}


        </CardTitle>
      </CardHeader>

        <CardContent className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid gap-4">
              <div>
                <Label className="mb-1.5 block">Nama Properti</Label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ciputra Residence BSD Cluster Aster" />
              </div>

              <div>
                <Label className="mb-1.5 block">Developer</Label>
                <Select
                  onValueChange={(v) => setFormData({ ...formData, developer: v })}
                  value={formData.developer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.length > 0 ? (
                      developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.companyName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Memuat developer...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

              </div>

              <div>
                <Label className="mb-1.5 block">Tipe Properti</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, tipe: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Tipe Properti" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rumah">Rumah</SelectItem>
                    <SelectItem value="apartemen">Apartemen</SelectItem>
                    <SelectItem value="ruko">Ruko</SelectItem>
                    <SelectItem value="tanah">Tanah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Alamat Lengkap</Label>
                <Textarea name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Jl. BSD Raya Utama No. 5, Tangerang Selatan" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Kota atau Kabupaten</Label>
                  <Input name="kota" value={formData.kota} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Provinsi</Label>
                  <Input name="provinsi" value={formData.provinsi} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block">Kecamatan</Label>
                  <Input
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    placeholder="Contoh: Serpong"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Kelurahan</Label>
                  <Input
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleChange}
                    placeholder="Contoh: Lengkong Gudang"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Kode Pos</Label>
                    <Input
                      name="kodePos"
                      value={formData.kodePos}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, ""); // hapus semua non-digit
                        setFormData({ ...formData, kodePos: onlyNumbers });
                      }}
                      placeholder="Contoh: 15310"
                      maxLength={5}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Latitude</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    name="latitude"
                    value={formData.latitude}
                    onChange={(e) => {
                      let val = e.target.value.replace(",", "."); // ganti koma jadi titik
                      // izinkan minus di awal dan hanya satu titik
                      if (/^-?\d*(\.\d{0,8})?$/.test(val)) {
                        setFormData({ ...formData, latitude: val });
                      }
                    }}
                    onKeyDown={(e) => {
                      // hanya boleh angka, titik, minus, dan kontrol
                      if (
                        !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|\-|\./.test(e.key)
                      ) {
                        e.preventDefault();
                      }

                      // hanya izinkan 1 minus di depan
                      if (e.key === "-" && e.currentTarget.selectionStart !== 0) {
                        e.preventDefault();
                      }

                      // hanya izinkan 1 titik
                      if (e.key === "." && e.currentTarget.value.includes(".")) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="-6.24412345"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Longitude</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    name="longitude"
                    value={formData.longitude}
                    onChange={(e) => {
                      let val = e.target.value.replace(",", ".");
                      if (/^-?\d*(\.\d{0,8})?$/.test(val)) {
                        setFormData({ ...formData, longitude: val });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|\-|\./.test(e.key)
                      ) {
                        e.preventDefault();
                      }
                      if (e.key === "-" && e.currentTarget.selectionStart !== 0) {
                        e.preventDefault();
                      }
                      if (e.key === "." && e.currentTarget.value.includes(".")) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="106.82900000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid gap-4">
              <div>
                <Label className="mb-1.5 block">Harga Properti (Total)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="hargaTotal"
                  value={formData.hargaTotal}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, hargaTotal: onlyNumbers });
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="850000000"
                />
              </div>

              <div>
                <Label className="mb-1.5 block">Harga Tanah/m²</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="hargaTanah"
                  value={formData.hargaTanah}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, hargaTanah: onlyNumbers });
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Contoh: 1500000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Biaya Pemeliharaan (opsional)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="biayaPemeliharaan"
                    value={formData.biayaPemeliharaan}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, biayaPemeliharaan: onlyNumbers });
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Contoh: 300000"
                  />

                </div>
                <div>
                  <Label className="mb-1.5 block">Nilai PBB (opsional)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="pbb"
                    value={formData.pbb}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, pbb: onlyNumbers });
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Contoh: 2500000"
                  />

                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Sertifikat</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, sertifikat: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Sertifikat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHM">SHM</SelectItem>
                    <SelectItem value="HGB">HGB</SelectItem>
                    <SelectItem value="HGU">HGU</SelectItem>
                    <SelectItem value="HP">HP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Deskripsi (opsional)</Label>
                <Input name="biayaTambahan" value={formData.biayaTambahan} onChange={handleChange} placeholder="" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Luas Tanah (m²)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    name="luasTanah"
                    value={formData.luasTanah}
                    onChange={(e) => {
                      // Hanya angka dan maksimal 2 digit desimal
                      const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setFormData({ ...formData, luasTanah: value });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|\./.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Contoh: 120.50"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Luas Bangunan (m²)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    name="luasBangunan"
                    value={formData.luasBangunan}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setFormData({ ...formData, luasBangunan: value });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|\./.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Contoh: 85.75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="mb-1.5 block">Kamar Tidur</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    name="kamarTidur"
                    value={formData.kamarTidur}
                    onChange={(e) => setFormData({ ...formData, kamarTidur: e.target.value.replace(/\D/g, "") })}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="3"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Kamar Mandi</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    name="kamarMandi"
                    value={formData.kamarMandi}
                    onChange={(e) => setFormData({ ...formData, kamarMandi: e.target.value.replace(/\D/g, "") })}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="2"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Lantai</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    name="lantai"
                    value={formData.lantai}
                    onChange={(e) => setFormData({ ...formData, lantai: e.target.value.replace(/\D/g, "") })}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="2"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Garasi</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    name="garasi"
                    value={formData.garasi}
                    onChange={(e) => setFormData({ ...formData, garasi: e.target.value.replace(/\D/g, "") })}
                    onKeyDown={(e) => {
                      if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Tahun Bangun atau Renovasi</Label>
                <Input
                  type="number"
                  name="tahunBangun"
                  value={formData.tahunBangun}
                  onChange={(e) => setFormData({ ...formData, tahunBangun: e.target.value.replace(/\D/g, "") })}
                  onKeyDown={(e) => {
                    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault();
                  }}
                  placeholder="2022"
                />
              </div>
            </div>
          )}


          {/* STEP 4 - UPLOAD GAMBAR */}

          {step === 4 && (
            <Empty className="border border-dashed rounded-2xl p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="text-primary">
                  <IconFolder size={40} stroke={1.5} />
                </EmptyMedia>
                <EmptyTitle>Upload Gambar Properti</EmptyTitle>
                <EmptyDescription>
                  Tambahkan gambar properti baru untuk profil properti.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="grid grid-cols-2 gap-4">
                  {imageSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="relative border border-dashed rounded-xl aspect-square flex items-center justify-center overflow-hidden"
                    >
                      {slot.preview ? (
                        <img src={slot.preview || ""} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center justify-center">
                          <Plus className="w-8 h-8" />
                          <span className="text-xs mt-1">Tambah Gambar</span>
                        </div>
                      )}
                      <input
                        id={`image-slot-${idx}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onSelectImage(idx, e.target.files?.[0] || undefined)}
                      />
                      <label htmlFor={`image-slot-${idx}`} className="absolute inset-0 cursor-pointer" />
                      {slot.uploading && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </EmptyContent>
            </Empty>
          )}
          {/* STEP 4 - UPLOAD GAMBAR
          {step === 4 && (
            <Empty className="border border-dashed rounded-2xl p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="text-primary">
                  <IconFolder size={40} stroke={1.5} />
                </EmptyMedia>
                <EmptyTitle>Add Your Files</EmptyTitle>
                <EmptyDescription>
                  Tambahkan gambar properti baru untuk profil properti.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm">
                  Upload Files
                </Button>
              </EmptyContent>
            </Empty>
          )} */}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Kembali
            </Button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <Button onClick={nextStep}>Lanjut</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Properti"}
            </Button>
          )}

        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Langkah {step} dari 4
      </div>
    </div>
  )
}

