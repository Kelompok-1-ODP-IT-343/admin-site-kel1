"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { assignAdmins, getPengajuanDetail, getApprovers, Approver } from "@/services/approvekpr";
import { toast } from "sonner";

export default function AssignApprovalDialog() {
  const searchParams = useSearchParams();
  const [verifikator2, setVerifikator2] = useState("");
  const [verifikator3, setVerifikator3] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [developerName, setDeveloperName] = useState<string>("-");
  const [loadingDev, setLoadingDev] = useState<boolean>(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loadingApprovers, setLoadingApprovers] = useState<boolean>(false);

  useEffect(() => {
    const applicationId = Number(searchParams.get("id"));
    if (!applicationId) return;
    const fetchDetail = async () => {
      setLoadingDev(true);
      try {
        const data = await getPengajuanDetail(applicationId);
        const name = data?.developerInfo?.companyName || "-";
        setDeveloperName(name);
      } catch (e) {
        setDeveloperName("-");
      } finally {
        setLoadingDev(false);
      }
    };
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchApprovers = async () => {
      setLoadingApprovers(true);
      try {
        const list = await getApprovers();
        setApprovers(list);
      } catch (e) {
        setApprovers([]);
      } finally {
        setLoadingApprovers(false);
      }
    };
    fetchApprovers();
  }, []);

  const handleSubmit = async () => {
    const applicationId = Number(searchParams.get("id"));
    if (!applicationId) {
      setFeedback("Application ID tidak ditemukan di URL.");
      return;
    }
    if (!verifikator2 || !verifikator3) {
      setFeedback("Silakan pilih Admin 1 dan Admin 2.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await assignAdmins({
        applicationId,
        firstApprovalId: Number(verifikator2),
        secondApprovalId: Number(verifikator3),
      });

      toast.success(res.message || "Assign berhasil ✅");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Gagal assign admin ❌";
      toast.error(String(msg));
    } finally {
      setSubmitting(false);
    }
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
              <span className="font-semibold text-gray-900">
                {loadingDev ? "Memuat..." : developerName}
              </span>
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
              <option value="">{loadingApprovers ? "Memuat approver..." : "-- Pilih Approver --"}</option>
              {approvers.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.fullName}
                </option>
              ))}
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
              <option value="">{loadingApprovers ? "Memuat approver..." : "-- Pilih Approver --"}</option>
              {approvers.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-[#3FD8D4] hover:bg-[#3FD8D4]/80 text-white rounded-2xl px-5 py-3"
            >
              <Send className="h-4 w-4" /> {submitting ? "Mengirim..." : "Kirim"}
            </Button>
          </div>

          {feedback && (
            <p className="text-xs mt-2 text-gray-700">{feedback}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
