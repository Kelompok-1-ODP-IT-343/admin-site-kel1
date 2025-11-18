"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { getUserProfile, updateUserProfile } from "@/services/akun";
import { toast } from "sonner";
import coreApi from "@/lib/coreApi";
import { usePathname } from "next/navigation";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import {
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  CircleCheckBig,
  AlertTriangle,
  Info,
  OctagonAlert,
  BellDot
} from "lucide-react";

const COLORS = {
  teal: "#3FD8D4",
  gray: "#757575",
  orange: "#FF8500",
  lime: "#DDEE59",
};
type Section = "settings" | "notifications" | "help";
function getAvatarColor(name: string): string {
  const colors = [
    "#3FD8D4", // BNI teal
    "#FF8500", // BNI orange
    "#0B63E5", // BNI blue
    "#DDEE59", // lime accent
    "#6C63FF", // purple
    "#00C49F", // emerald
  ];
  // Ambil warna berdasarkan kode unik nama
  const index = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

function AkunContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Section>("settings");
  const [user, setUser] = useState<any>(null); 
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("🟡 Fetching user profile...");
        const data = await getUserProfile();
        console.log("✅ Response data:", data);
        setUser(data);
      } catch (err) {
        console.error("❌ Error saat ambil profil:", err);
      }
    };
    fetchProfile();
  }, []);


  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );

  const goLogout = () => router.push("/");
  const goBack = () => router.push("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image src="/logo-satuatap.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-xl text-[#FF8500]">satuatap</span>
          </div>

          {/* Tombol Back */}
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-[#0B63E5] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
          {/* SIDEBAR */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-5 border-b">
                <div className="flex items-center gap-3 px-5 py-5 border-b">
                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white uppercase select-none shadow-sm">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || "User profile picture"}
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor: getAvatarColor(user?.fullName || user?.roleName || "Default"),
                        }}
                      >
                        {(
                          (user?.fullName || user?.name || user?.roleName || "U")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w: string) => w[0])
                            .join("")
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col">
                    <h3 className="!text-sm !font-medium text-gray-900 leading-tight">
                      {user?.fullName || user?.name || "-"}
                    </h3>
                    <p className="!text-[10px] text-gray-500 truncate max-w-[120px]">
                      {user?.email || "-"}
                    </p>
                  </div>
                </div>


                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 -mt-0.5">{user.role}</p>
                </div>
              </div>

              {/* Menu Items */}
              <SidebarItem
                active={active === "settings"}
                title="Account Settings"
                icon={<Settings className="h-5 w-5" />}
                onClick={() => {
                  setActive("settings");
                  router.replace("/akun?tab=settings");
                }}
              />

              <SidebarItem
                active={active === "notifications"}
                title="Notifications"
                icon={<Bell className="h-5 w-5" />}
                onClick={() => {
                  setActive("notifications");
                  router.replace("/akun?tab=notifications");
                }}
              />

              <SidebarItem
                active={active === "help"}
                title="Help"
                icon={<HelpCircle className="h-5 w-5" />}
                onClick={() => {
                  setActive("help");
                  router.replace("/akun?tab=help");
                }}
              />

              <div className="h-px bg-gray-100 mx-4" />

              <button
                onClick={goLogout}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="md:col-span-8 lg:col-span-9">
            <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-12">
              {active === "settings" && user && <SettingsContent user={user} />}
              {active === "notifications" && <NotificationsContent />}
              {active === "help" && <HelpContent />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function AkunPage() {
  return (
    <Suspense fallback={<></>}>
      <AkunContent />
    </Suspense>
  );
}

/* Sidebar Item */
function SidebarItem({
  title,
  icon,
  onClick,
  active,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 transition ${
        active ? "bg-[#F5FAFF]" : "hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex items-center gap-3 ${
          active ? "text-[#0B63E5]" : "text-gray-800"
        }`}
      >
        <div
          className={`h-9 w-9 grid place-items-center rounded-xl ${
            active ? "bg-[#EAF2FF]" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <ChevronRight
        className={`h-4 w-4 ${active ? "text-[#0B63E5]" : "text-gray-400"}`}
      />
    </button>
  );
}

/* Content */
function SettingsContent({ user }: { user: any }) {
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await toast.promise(
        updateUserProfile(user.id, { fullName, username, phone }),
        {
          loading: "Menyimpan perubahan...",
          success: "Perubahan berhasil disimpan.",
          error: (e) => e?.response?.data?.message || e?.message || "Gagal menyimpan perubahan.",
        }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="akun w-full">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        {/* --- Account Info --- */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your personal information here. Click save when finished.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" readOnly className="bg-gray-50 cursor-not-allowed" defaultValue={user?.email || ""} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="department">Position</Label>
                <Input
                  id="department"
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  defaultValue={user?.roleName || "-"}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="lastUpdate">Last Update</Label>
                <Input
                  id="lastUpdate"
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  defaultValue={
                    user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"
                  }
                />
              </div>


            </CardContent>

            <CardFooter>
              <div className="w-full flex items-center justify-end gap-3">
                <Button
                  className="ml-auto bg-[#0B63E5] hover:bg-[#094ec1]"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- Password Change --- */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password. After saving, you may need to log in again.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" readOnly className="bg-gray-50 cursor-not-allowed" placeholder="••••••••" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" readOnly className="bg-gray-50 cursor-not-allowed" placeholder="••••••••" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" readOnly className="bg-gray-50 cursor-not-allowed" placeholder="••••••••" />
              </div>
            </CardContent>

            <div className="px-6 pb-2 text-sm text-muted-foreground font-semibold">
              Ganti Password tidak tersedia untuk Admin. Hubungi support@satuatap.com untuk mengganti password.
            </div>

            <CardFooter>

            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationsContent() {
  type Notification = {
    id: number;
    userId: number;
    notificationType: string;
    title: string;
    message: string;
    channel: string;
    status: string;
    scheduledAt: string | null;
    sentAt: string | null;
    deliveredAt: string | null;
    readAt: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    read: boolean;
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setError(null);
        setLoading(true);
        const res = await coreApi.get("/notifications/user");
        const list = (res?.data?.data ?? []) as any[];
        const mapped: Notification[] = list.map((n) => ({
          id: Number(n.id),
          userId: Number(n.userId),
          notificationType: String(n.notificationType || ""),
          title: String(n.title || ""),
          message: String(n.message || ""),
          channel: String(n.channel || "IN_APP"),
          status: String(n.status || "PENDING"),
          scheduledAt: n.scheduledAt ?? null,
          sentAt: n.sentAt ?? null,
          deliveredAt: n.deliveredAt ?? null,
          readAt: n.readAt ?? null,
          metadata: n.metadata ?? null,
          createdAt: String(n.createdAt || new Date().toISOString()),
          read: Boolean(n.readAt),
        }));
        setNotifications(mapped);
        setPage(1);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Gagal memuat notifikasi";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const maxPage = Math.max(1, Math.ceil(notifications.length / pageSize));
  const paged = notifications.slice((page - 1) * pageSize, page * pageSize);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(maxPage, p + 1));

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const markOneRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const classifyCategory = (n: Notification): "success" | "info" | "warning" | "error" => {
    const t = (n.title || "").toLowerCase();
    const m = (n.message || "").toLowerCase();
    const has = (s: string) => t.includes(s) || m.includes(s);
    if (has("berhasil") || has("success") || n.status === "DELIVERED") return "success";
    if (has("otp") && (has("berhasil") || has("dikirim"))) return "info";
    if (has("token") && has("berhasil")) return "info";
    if (has("gagal") || has("error") || n.status === "FAILED") return "error";
    if (has("caution") || has("hati-hati") || has("warning") || n.status === "PENDING") return "warning";
    if (n.status === "SENT") return "info";
    return "info";
  };
  const styleByCategory = (cat: "success" | "info" | "warning" | "error") => {
    switch (cat) {
      case "success":
        return { border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", icon: <CircleCheckBig className="size-4 text-emerald-600" /> };
      case "info":
        return { border: "border-cyan-400", bg: "bg-cyan-50", text: "text-cyan-700", icon: <Info className="size-4 text-cyan-600" /> };
      case "warning":
        return { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700", icon: <AlertTriangle className="size-4 text-amber-600" /> };
      case "error":
      default:
        return { border: "border-red-400", bg: "bg-red-50", text: "text-red-700", icon: <OctagonAlert className="size-4 text-red-600" /> };
    }
  };

  const titleCaseBadge = (s?: string): string => {
    if (!s) return "-";
    return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BellDot className="size-5 text-cyan-600" />
          Notifications
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="text-sm border-cyan-500 text-cyan-700 hover:bg-cyan-50 transition-colors"
          onClick={markAllRead}
        >
          Mark all as read
        </Button>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Memuat notifikasi...</div>
      )}
      {error && (
        <Alert className="border-red-300 bg-red-50 text-red-700">
          <AlertTitle>Gagal memuat</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {!loading && !error && paged.map((notif) => {
          const cat = classifyCategory(notif);
          const style = styleByCategory(cat);
          const created = new Date(notif.createdAt).toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={notif.id}
              onClick={() => markOneRead(notif.id)}
              className={`relative flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all duration-200 
                hover:shadow-sm hover:scale-[1.01] border ${style.border} ${style.bg} ${style.text}`}
            >
              <div className="mt-1">{style.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <AlertTitle className="font-semibold">{notif.title}</AlertTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-gray-300 text-gray-700">{titleCaseBadge(notif.status)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-gray-300 text-gray-700">{titleCaseBadge(notif.channel)}</span>
                  </div>
                </div>
                <AlertDescription className="text-sm leading-snug mt-1">{notif.message}</AlertDescription>
                <div className="text-xs text-gray-500 mt-1">{created}</div>
              </div>
              {!notif.read && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 size-3 bg-cyan-500 rounded-full shadow-sm ring-2 ring-white"></span>
              )}
            </div>
          );
        })}
      </div>

      {!loading && !error && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-xs text-gray-600">Page {page} / {maxPage}</span>
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={goPrev}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={goNext}
            disabled={page >= maxPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}


function HelpContent() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B63E5] mb-2">
          Help Center
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Panduan untuk administrator{" "}
          <span className="font-semibold text-[#FF8500]">Satu Atap</span>.  
          Jika masih mengalami kendala, hubungi tim support di{" "}
          <span className="font-semibold text-[#0B63E5]">
            support@satuatap.com
          </span>.
        </p>
      </div>

      {/* ACCORDION */}
      <Accordion
        type="single"
        collapsible
        className="w-full divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-[#fafafa] shadow-sm"
        defaultValue="item-1"
      >
        {[
          {
            id: "1",
            q: "Bagaimana cara menambahkan properti baru?",
            a: "Masuk ke menu Properties → Add New Property di dashboard admin. Lengkapi data properti seperti developer, tipe, harga, dan gambar. Tekan Save untuk menyimpan.",
          },
          {
            id: "2",
            q: "Bagaimana mengelola data developer?",
            a: "Gunakan halaman Developers untuk menambah, mengedit, atau menghapus developer. Pastikan data sesuai dengan daftar rekanan resmi BNI.",
          },
          {
            id: "3",
            q: "Bagaimana proses approval pengajuan KPR?",
            a: "Masuk ke Customer Applications, buka detail pengajuan, dan periksa kelengkapan dokumen. Tekan Approve atau Reject sesuai hasil verifikasi.",
          },
          {
            id: "4",
            q: "Bagaimana cara memperbarui data pengguna admin?",
            a: "Buka Account Settings → Account untuk memperbarui nama, email, atau jabatan. Klik Save Changes untuk menyimpan perubahan.",
          },
          {
            id: "5",
            q: "Apa yang harus dilakukan jika sistem error atau tidak bisa login?",
            a: "Coba refresh halaman. Jika tetap error, kirim laporan ke support@satuatap.com dengan screenshot dan waktu kejadian.",
          },
          {
            id: "6",
            q: "Bagaimana menjaga keamanan data nasabah?",
            a: "Gunakan jaringan internal BNI dan jangan bagikan kredensial admin. Semua aktivitas tercatat di audit log.",
          },
        ].map((item) => (
          <AccordionItem key={item.id} value={`item-${item.id}`}>
            <AccordionTrigger
              className="text-[15px] font-semibold text-gray-900 hover:text-[#0B63E5] px-6 py-4 transition-colors"
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 px-6 pb-5 text-sm leading-relaxed bg-[#fcfcfc]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}



/* Helpers */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <input
        defaultValue={value}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3FD8D4]"
      />
    </label>
  );
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
