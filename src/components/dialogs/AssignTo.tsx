"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Send } from "lucide-react";
import { useState } from "react";

export default function AssignApprovalDialog() {
  const [verifikator2, setVerifikator2] = useState("");
  const [verifikator3, setVerifikator3] = useState("");

  const handleSubmit = () => {
    alert(`Persetujuan dikirim:\n- Verifikator 2: ${verifikator2}\n- Verifikator 3: ${verifikator3}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3FD8D4] hover:bg-[#3FD8D4]/80 text-white shadow font-medium">
          Assign To
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader className="flex items-center gap-2">
          <Info className="h-6 w-6 text-[#3FD8D4]" />
          <DialogTitle className="text-xl font-semibold text-gray-800">Persetujuan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-2">
          {/* Persetujuan 1 */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-medium text-gray-700 mb-1">Persetujuan 1</p>
            <p className="text-gray-600">
              Developer:{" "}
              <span className="font-semibold text-gray-900">PT Ciputra Development Tbk</span>
            </p>
          </div>

          {/* Persetujuan 2 */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-medium text-gray-700 mb-2">Persetujuan 2</p>
            <label className="text-xs font-medium text-gray-600">Verifikator:</label>
            <select
              value={verifikator2}
              onChange={(e) => setVerifikator2(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Pilih Verifikator --</option>
              <option value="Admin 1">Admin 1</option>
              <option value="Admin 2">Admin 2</option>
              <option value="Admin 3">Admin 3</option>
            </select>
          </div>

          {/* Persetujuan 3 */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <p className="font-medium text-gray-700 mb-2">Persetujuan 3</p>
            <label className="text-xs font-medium text-gray-600">Verifikator:</label>
            <select
              value={verifikator3}
              onChange={(e) => setVerifikator3(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Pilih Verifikator --</option>
              <option value="Admin 1">Admin 1</option>
              <option value="Admin 2">Admin 2</option>
              <option value="Admin 3">Admin 3</option>
            </select>
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#3FD8D4] hover:bg-[#3FD8D4]/80 text-white rounded-2xl px-5 py-3"
            >
              <Send className="h-4 w-4" /> Kirim
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
