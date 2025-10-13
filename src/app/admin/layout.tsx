"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { href: "/admin", label: "Home", icon: "/home.png" },
    { href: "/admin/dashboard", label: "Dashboard", icon: "/dashboard.png" },
    { href: "/admin/draft", label: "Draft", icon: "/draft.png" },
    { href: "/admin/review", label: "Review", icon: "/review.png" },
    { href: "/admin/approval", label: "Approval", icon: "/approval.png" },
    { href: "/admin/history", label: "History", icon: "/history.png" },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-6">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <img
            src="/sidebar_satuatap.png"
            alt="Satu Atap Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[260px] p-4 border-r min-h-[calc(100vh-56px)]">
          <div className="bg-slate-50 rounded-2xl px-4 py-2 mb-4 shadow-sm">
            Welcome,{" "}
            <span className="font-semibold text-emerald-700">Admin Ahong</span>
          </div>
          <nav className="space-y-1">
            {menu.map((m) => {
              const active = pathname === m.href;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    active
                      ? "bg-[#3FD8D4]/20 border-[#3FD8D4] font-semibold"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <img
                    src={m.icon}
                    alt={m.label}
                    className="w-5 h-5 object-contain"
                  />
                  <span>{m.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-slate-50 rounded-2xl px-4 py-2 shadow-sm">
              &nbsp;
            </div>
            <div className="font-semibold text-teal-800">
              {dateStr} | {timeStr}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
