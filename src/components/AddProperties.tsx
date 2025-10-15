"use client"

"use client"

import { useState } from "react"
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

export default function AddProperties() {
  const [step, setStep] = useState(1)

  // State sementara untuk data form
  const [formData, setFormData] = useState({
    namaProperti: "",
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
    cicilan: "",
    biayaTambahan: "",
    luasTanah: "",
    luasBangunan: "",
    kamarTidur: "",
    kamarMandi: "",
    lantai: "",
    tahunBangun: "",
    kondisi: "",
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
          <CardTitle>
            {step === 1 && "🏠 Informasi Dasar Properti"}
            {step === 2 && "💰 Informasi Harga & Pembiayaan"}
            {step === 3 && "📐 Spesifikasi Fisik"}
            {step === 4 && "📁 Upload Gambar"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid gap-4">
              <div>
                <Label>Nama Properti / Proyek</Label>
                <Input name="namaProperti" value={formData.namaProperti} onChange={handleChange} placeholder="Ciputra Residence BSD Cluster Aster" />
              </div>

              <div>
                <Label>Developer</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, developer: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Developer" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciputra">Ciputra Group</SelectItem>
                    <SelectItem value="sinarmas">Sinar Mas Land</SelectItem>
                    <SelectItem value="summarecon">Summarecon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipe Properti</Label>
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
                <Label>Alamat Lengkap</Label>
                <Textarea name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Jl. BSD Raya Utama No. 5, Tangerang Selatan" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kota / Kabupaten</Label>
                  <Input name="kota" value={formData.kota} onChange={handleChange} />
                </div>
                <div>
                  <Label>Provinsi</Label>
                  <Input name="provinsi" value={formData.provinsi} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>Koordinat (opsional)</Label>
                <Input name="koordinat" value={formData.koordinat} onChange={handleChange} placeholder="-6.244, 106.829" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid gap-4">
              <div>
                <Label>Harga Properti (Total)</Label>
                <Input name="hargaTotal" value={formData.hargaTotal} onChange={handleChange} placeholder="850000000" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Harga Tanah /m²</Label>
                  <Input name="hargaTanah" value={formData.hargaTanah} onChange={handleChange} />
                </div>
                <div>
                  <Label>Harga Bangunan /m²</Label>
                  <Input name="hargaBangunan" value={formData.hargaBangunan} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>DP Minimal (%)</Label>
                  <Input name="dp" value={formData.dp} onChange={handleChange} />
                </div>
                <div>
                  <Label>Cicilan Awal Estimasi</Label>
                  <Input name="cicilan" value={formData.cicilan} onChange={handleChange} readOnly className="bg-muted" />
                </div>
              </div>

              <div>
                <Label>Biaya Tambahan (opsional)</Label>
                <Input name="biayaTambahan" value={formData.biayaTambahan} onChange={handleChange} placeholder="BPHTB, Notaris, PPN" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Luas Tanah (m²)</Label>
                  <Input name="luasTanah" value={formData.luasTanah} onChange={handleChange} />
                </div>
                <div>
                  <Label>Luas Bangunan (m²)</Label>
                  <Input name="luasBangunan" value={formData.luasBangunan} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Kamar Tidur</Label>
                  <Input name="kamarTidur" value={formData.kamarTidur} onChange={handleChange} />
                </div>
                <div>
                  <Label>Kamar Mandi</Label>
                  <Input name="kamarMandi" value={formData.kamarMandi} onChange={handleChange} />
                </div>
                <div>
                  <Label>Lantai</Label>
                  <Input name="lantai" value={formData.lantai} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>Tahun Bangun / Renovasi</Label>
                <Input name="tahunBangun" value={formData.tahunBangun} onChange={handleChange} />
              </div>

              <div>
                <Label>Kondisi Properti</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, kondisi: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Kondisi" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baru">Baru</SelectItem>
                    <SelectItem value="bekas">Bekas</SelectItem>
                    <SelectItem value="pembangunan">Dalam Pembangunan</SelectItem>
                  </SelectContent>
                </Select>
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
                <EmptyTitle>Belum Ada Properti</EmptyTitle>
                <EmptyDescription>
                  Tambahkan properti baru agar bisa muncul di daftar dan disimulasikan.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm">
                  Tambah Properti
                </Button>
              </EmptyContent>
            </Empty>
          )}
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
            <Button variant="default">Simpan Properti</Button>
          )}
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Langkah {step} dari 4
      </div>
    </div>
  )
}

