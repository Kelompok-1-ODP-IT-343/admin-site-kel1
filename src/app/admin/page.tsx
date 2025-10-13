"use client";

import { useKPR } from "@/store/kprStore";
import StatCard from "@/components/admin/StatCard";

export default function AdminHomePage() {
  const { count } = useKPR();

  const stats = [
    {
      title: "Draft",
      count: count("draft"),
      color: "blue" as const,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h12l4 4v12H4z"/>
          <path d="M16 4v4h4"/>
        </svg>
      ),
    },
    {
      title: "Review", 
      count: count("review"),
      color: "yellow" as const,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.3-4.3"/>
        </svg>
      ),
    },
    {
      title: "Approval",
      count: count("approval"),
      color: "green" as const,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6l-11 11-5-5"/>
        </svg>
      ),
    },
    {
      title: "Rejected",
      count: count("rejected"),
      color: "red" as const,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Selamat Datang di Admin Panel KPR BNI
        </h1>
        <p className="text-gray-600">
          Kelola pengajuan KPR dengan mudah dan efisien
        </p>
      </div>

      {/* Admin Confirmation Message */}
      <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-teal-800">
              Anda telah masuk ke halaman admin
            </h2>
            <p className="text-teal-600 mt-1">
              Akses penuh ke sistem manajemen KPR tersedia
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            count={stat.count}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 font-medium">Review Draft</div>
            <div className="text-sm text-blue-500 mt-1">
              {count("draft")} pengajuan menunggu
            </div>
          </button>
          <button className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors">
            <div className="text-yellow-600 font-medium">Proses Review</div>
            <div className="text-sm text-yellow-500 mt-1">
              {count("review")} dalam review
            </div>
          </button>
          <button className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors">
            <div className="text-green-600 font-medium">Final Approval</div>
            <div className="text-sm text-green-500 mt-1">
              {count("approval")} siap disetujui
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}