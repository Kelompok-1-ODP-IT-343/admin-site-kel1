"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle" // 🌙 import toggle

import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import ChartsSection from "@/components/ChartsSection"
import AddProperties from "@/components/AddProperties"
import ApprovalSection from "@/components/ApprovalSection"
import CustomerInfo from "@/components/CustomerInfo"
import DeveloperInfo from "@/components/DeveloperInfo"
import PropertiesList from "@/components/ListProperties"
import ApprovalProperties from "@/components/ApprovalProperties"
import ApprovalHistory from "@/components/ApprovalHistory"
import TimeTicker from "@/components/TimeTicker"
import coreApi from "@/lib/coreApi"

export default function Dashboard() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState("Home")
  const [range, setRange] = useState("30d")
  const [stats, setStats] = useState<any | null>(null)
  // Removed per-second state updates on the whole Dashboard to avoid re-rendering tables/menus


  // 🧩 Proteksi: redirect hanya bila TIDAK ada token dan TIDAK ada refreshToken
  useEffect(() => {
    const getCookie = (name: string) =>
      document.cookie.split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1]

    const token = getCookie("token")
    const refreshToken = getCookie("refreshToken")

    if (!token && !refreshToken) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const res = await coreApi.get("/stat-admin/dashboard", { params: { range } })
        const payload = res?.data?.data ?? null
        if (!cancelled) setStats(payload)
      } catch {
        if (!cancelled) setStats(null)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [range])

  // 🔧 Logout handler: hapus token dari cookie
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;" // hapus cookie
    router.push("/login")
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return (
          <div className="space-y-8 p-6">
            <AnalyticsDashboard
              range={range}
              onRangeChange={setRange}
              kpi={stats?.kpi ?? null}
            />
            <ChartsSection
              growthDemand={(stats?.growthAndDemand?.data ?? []).map((d: any) => ({ name: String(d.month || ""), approval: Number(d.approval || 0), reject: Number(d.reject || 0) }))}
              outstandingLoan={(stats?.outstandingLoan?.data ?? []).map((d: any) => ({ name: String(d.month || ""), value: Number(d.value || 0) }))}
              funnel={(stats?.processingFunnel?.stages ?? []).map((s: any) => ({ name: String(s.stage || ""), value: Number(s.count || 0) }))}
              userRegistered={(stats?.userRegistered?.data ?? []).map((d: any) => ({ month: String(d.month || ""), total: Number(d.count || 0) }))}
            />
          </div>
        )
      case "Assign KPR":
        return <ApprovalSection />
      // case "Approval Properties":
      //   return <ApprovalProperties />
      case "Assign History":
        return <ApprovalHistory />
      case "Customer List":
        return <CustomerInfo />
      case "Developer List":
        return <DeveloperInfo />
      case "Properties List":
        return <PropertiesList />
      case "Add Properties":
        return <AddProperties />
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeMenu={activeMenu}
        onSelect={setActiveMenu}
        onLogout={handleLogout} // 🧩 gunakan handler logout baru
      />
      <SidebarInset>
        <main className="flex-1 p-8">
          {/* HEADER */}
          <header className="flex justify-between items-center mb-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <TimeTicker />
            </div>

            {/* 🌙 TOGGLE BUTTON */}
            <ModeToggle />
          </header>

          {/* DYNAMIC CONTENT */}
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
