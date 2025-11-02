"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UiDeveloper, uiToApi, apiToUi } from "@/lib/developer-mapper";
import { getDeveloperById, updateDeveloper } from "@/services/developers";
import { toast } from "sonner";

function generateInitials(name: string): string {
  const cleanName = name.replace(/^(PT\.?\s+|CV\.?\s+)/i, "").trim();

  return cleanName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}


function getPastelColor(seed: string): string {
  // bikin warna dari hash sederhana
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  // ubah hash ke hue (0–360)
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 85%)`; // pastel lembut
}


export default function ViewDeveloperDialog({
  open,
  onOpenChange,
  developer,
  onUpdated, // <- NEW
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developer: UiDeveloper | null;
  onUpdated?: (updated: UiDeveloper) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<UiDeveloper | null>(developer);

  // refresh isi dialog saat prop developer berubah
  useEffect(() => {
    setEditedData(developer || null);
  }, [developer]);

  // (opsional) fetch detail terkini ketika dialog dibuka
  useEffect(() => {
    if (!open || !developer) return;
    (async () => {
      try {
        const res = await getDeveloperById(developer.id);
        const fresh = apiToUi(res?.data);
        setEditedData(fresh);
      } catch (e) {
        // abaikan, tetap pakai data dari list
        console.warn("Load detail failed:", e);
      }
    })();
  }, [open, developer]);

  if (!editedData) return null;

  const handleChange = (field: keyof UiDeveloper, value: string) => {
    setEditedData(prev => (prev ? { ...prev, [field]: value } as UiDeveloper : prev));
  };

  const handleSave = async () => {
    if (!editedData) return;
    try {
      setSaving(true);
      toast.loading("Menyimpan perubahan developer...", { id: "save-developer" });
      const payload = uiToApi(editedData);
      const res = await updateDeveloper(editedData.id, payload);
      const updated = apiToUi(res?.data); // asumsi API balikin entity updated
      setEditedData(updated);
      setIsEditing(false);
      onUpdated?.(updated); // kabari parent (tabel) untuk sinkron
      toast.success("Perubahan developer berhasil disimpan", { id: "save-developer" });
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Gagal menyimpan perubahan developer.", { id: "save-developer" });
    } finally {
      setSaving(false);
    }
  };

  const level = editedData.partnership_level?.toUpperCase();
  const levelColor =
    level === "PLATINUM" ? "bg-blue-500 text-white"
    : level === "GOLD"     ? "bg-yellow-400 text-black"
    : level === "SILVER"   ? "bg-gray-400 text-white"
    : "bg-muted text-foreground";

  const hasLogo = !!editedData.logo;
  const initials = generateInitials(editedData.companyName);
  const bgColor = getPastelColor(editedData.companyName);
  const status = editedData?.status || developer?.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Developer Details</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        {/* <div className="rounded-xl border bg-muted/30 p-6 mt-2 flex flex-col items-center text-center gap-3"> */}
        <div className="relative rounded-xl border bg-muted/30 p-6 mt-2 flex flex-col items-center text-center gap-3">
          {/* Status Badge */}

          {status && (
            <Badge
              className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : status === "INACTIVE"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </Badge>
          )}
         
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-muted shadow-sm flex items-center justify-center text-3xl font-bold text-gray-700"
            style={{ backgroundColor: hasLogo ? "white" : bgColor }}
          >
            {hasLogo ? (
              <Image
                src={editedData.logo!}
                alt={editedData.companyName}
                fill
                className="object-fill"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>


          <div>
            {isEditing ? (
              <Input
                value={editedData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="text-center font-semibold text-lg h-8"
              />
            ) : (
              <h2 className="font-semibold text-lg">{editedData.companyName}</h2>
            )}

            {isEditing ? (
              <Input
                value={editedData.partnership_level}
                onChange={(e) => handleChange("partnership_level", e.target.value)}
                className="mt-2 text-center h-8"
              />
            ) : (
              <div className="flex flex-col items-center mt-1">
                <Badge className={`${levelColor}`}>
                  {editedData.partnership_level}
                </Badge>            
              </div>
            )}


          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <h3 className="font-semibold text-base mb-2">Description</h3>
          {isEditing ? (
            <textarea
              value={editedData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-24 text-sm border rounded-md p-2"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{editedData.description}</p>
          )}
        </div>

        {/* Summary fields */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <h3 className="font-semibold text-base mb-3">Developer Summary</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Contact Person", "contact_person"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Website", "website"],
              ["Established", "established_year"],
            ].map(([label, key]) => (
              <div key={key} className="flex justify-between border-b py-1 items-center">
                <span className="text-muted-foreground">{label}</span>
                {isEditing ? (
                  <Input
                    value={(editedData as any)[key]}
                    onChange={(e) => handleChange(key as any, e.target.value)}
                    className="w-[55%] h-7 text-sm"
                  />
                ) : key === "website" ? (
                  <a
                    href={(editedData as any)[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline text-right w-[55%]"
                  >
                    {(editedData as any)[key].replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="font-medium text-right w-[55%]">
                    {(editedData as any)[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <h3 className="font-semibold text-base mb-3">Address Details</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Address", "address"],
              ["City", "city"],
              ["Province", "province"],
              ["Postal Code", "postal_code"],
            ].map(([label, key]) => (
              <div key={key} className="flex justify-between border-b py-1 items-center">
                <span className="text-muted-foreground">{label}</span>
                {isEditing ? (
                  <Input
                    value={(editedData as any)[key]}
                    onChange={(e) => handleChange(key as any, e.target.value)}
                    className="w-[55%] h-7 text-sm"
                  />
                ) : (
                  <span className="font-medium text-right w-[55%]">
                    {(editedData as any)[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
