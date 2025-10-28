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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Home, Wallet, Ruler, ImageIcon } from "lucide-react"
const API = process.env.NEXT_PUBLIC_API_HOST;

export default function AddProperties() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchDevelopers() {
      const token =
        typeof document !== "undefined"
          ? document.cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1]
          : null;

      try {
        const res = await fetch(`${API}/api/v1/admin/developers?page=0&size=50`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json();
        if (json?.success) {
          setDevelopers(json.data.data || []); // sesuaikan struktur API kamu
        } else {
          console.warn("Gagal fetch developer:", json.message);
        }
      } catch (err) {
        console.error("Error fetching developers:", err);
      }
    }

    fetchDevelopers();
  }, []);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1)
  const handleSubmit = async () => {
    setLoading(true);

    // 🚀 bikin payload sesuai backend DTO
    const payload = {
      propertyCode: `PROP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      // developerId: Number(formData.developer) || 1, // ganti sesuai id developer beneran
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
      latitude: parseFloat(formData.koordinat.split(",")[0]) || -6.244,
      longitude: parseFloat(formData.koordinat.split(",")[1]) || 106.829,
      landArea: parseFloat(formData.luasTanah) || 0,
      buildingArea: parseFloat(formData.luasBangunan) || 0,
      bedrooms: parseInt(formData.kamarTidur) || 0,
      bathrooms: parseInt(formData.kamarMandi) || 0,
      floors: parseInt(formData.lantai) || 1,
      garage: parseInt(formData.garasi) || 1,
      yearBuilt: parseInt(formData.tahunBangun) || 2024,
      price: parseFloat(formData.hargaTotal) || 0,
      pricePerSqm: parseFloat(formData.hargaTanah) || 1000,
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
      alert("✅ Properti berhasil disimpan!");
      router.push("/dashboard");
    } else {
      alert(`❌ Gagal menyimpan properti: ${result.message}`);
    }
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

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))


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
                      alert("✅ Gambar berhasil di-upload!");
                      console.log("Image URL:", result.data);
                    } else {
                      alert(`❌ Upload gagal: ${result.message}`);
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
                    onChange={handleChange}
                    placeholder="Contoh: 15310"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Koordinat</Label>
                <Input name="koordinat" value={formData.koordinat} onChange={handleChange} placeholder="-6.244, 106.829" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid gap-4">
              <div>
                <Label className="mb-1.5 block">Harga Properti (Total)</Label>
                <Input name="hargaTotal" value={formData.hargaTotal} onChange={handleChange} placeholder="850000000" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Biaya Pemeliharaan (opsional)</Label>
                  <Input
                    name="biayaPemeliharaan"
                    value={formData.biayaPemeliharaan}
                    onChange={handleChange}
                    placeholder="Contoh: 300000"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Nilai PBB (opsional)</Label>
                  <Input
                    name="pbb"
                    value={formData.pbb}
                    onChange={handleChange}
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
                  <Input name="luasTanah" value={formData.luasTanah} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Luas Bangunan (m²)</Label>
                  <Input name="luasBangunan" value={formData.luasBangunan} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block">Kamar Tidur</Label>
                  <Input name="kamarTidur" value={formData.kamarTidur} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Kamar Mandi</Label>
                  <Input name="kamarMandi" value={formData.kamarMandi} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1.5 block">Lantai</Label>
                  <Input name="lantai" value={formData.lantai} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Garasi</Label>
                  <Input name="garasi" value={formData.garasi} onChange={handleChange} />
                </div>
              </div>
              

              <div>
                <Label className="mb-1.5 block">Tahun Bangun atau Renovasi</Label>
                <Input name="tahunBangun" value={formData.tahunBangun} onChange={handleChange} />
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
                      alert("✅ Gambar berhasil di-upload!");
                      console.log("Image URL:", result.data);
                    } else {
                      alert(`❌ Upload gagal: ${result.message}`);
                    }
                  }}
                >
                  {loading ? "Mengunggah..." : "Upload File"}
                </Button>
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

