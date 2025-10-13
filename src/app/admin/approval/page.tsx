"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKPR } from "@/store/kprStore";
import Table from "@/components/admin/Table";

export default function ApprovalPage() {
  const router = useRouter();
  const { getByStage, move } = useKPR();
  const [searchTerm, setSearchTerm] = useState("");
  
  const approvalCustomers = getByStage("approval");
  
  // Filter customers based on search term
  const filteredCustomers = approvalCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleApprove = (customerId: string) => {
    move(customerId, "approved");
    // Optionally show a success message
  };

  const handleReject = (customerId: string) => {
    move(customerId, "rejected");
    // Optionally show a success message
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (customer: any) => (
        <div className="font-medium text-gray-900">{customer.name}</div>
      ),
    },
    {
      key: "phone", 
      label: "Phone",
      render: (customer: any) => (
        <div className="text-gray-600">{customer.phone}</div>
      ),
    },
    {
      key: "email",
      label: "Email", 
      render: (customer: any) => (
        <div className="text-gray-600">{customer.email}</div>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted At",
      render: (customer: any) => (
        <div className="text-gray-600">
          {new Date(customer.submittedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      key: "loanAmount",
      label: "Loan Amount",
      render: (customer: any) => (
        <div className="font-medium text-blue-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(customer.loanAmount)}
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (customer: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprove(customer.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(customer.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Final Approval</h1>
            <p className="text-gray-600 mt-1">
              {filteredCustomers.length} pengajuan KPR menunggu persetujuan final
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {approvalCustomers.length} Pending Approval
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Applications
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              id="sort"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="amount">Jumlah Pinjaman</option>
              <option value="name">Nama A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Perhatian</h3>
            <p className="text-amber-700 mt-1">
              Keputusan approval atau reject bersifat final. Pastikan Anda telah meninjau semua dokumen dan informasi customer dengan teliti sebelum mengambil keputusan.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Pengajuan Final Approval
          </h2>
        </div>
        <Table
          data={filteredCustomers}
          columns={columns}
          emptyMessage="Tidak ada pengajuan yang menunggu approval"
        />
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">1</span> sampai{" "}
            <span className="font-medium">{filteredCustomers.length}</span> dari{" "}
            <span className="font-medium">{approvalCustomers.length}</span> hasil
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg">
              1
            </button>
            <button
              disabled
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}