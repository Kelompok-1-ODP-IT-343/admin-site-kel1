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

export default function Dashboard() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState("Home")

  // 🧩 Proteksi: kalau belum login (nggak ada token di cookie) → redirect ke /login
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
    }
  }, [router])

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
            <AnalyticsDashboard />
            <ChartsSection />
          </div>
        )
      case "Approval KPR":
        return <ApprovalSection />
      case "Approval Properties":
        return <ApprovalProperties />
      case "Approval History":
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
              <span className="font-medium">
                Friday | 3 October 2025 | 12:00:00
              </span>
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
