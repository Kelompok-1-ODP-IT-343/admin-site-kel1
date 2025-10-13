"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKPR } from "@/store/kprStore";
import Table from "@/components/admin/Table";
import type { Customer } from "@/types";

export default function ReviewPage() {
  const router = useRouter();
  const { byStage } = useKPR();
  const [searchTerm, setSearchTerm] = useState("");
  
  const reviewCustomers = byStage("review");
  
  // Filter customers based on search term
  const filteredCustomers = reviewCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleRowClick = (customer: Customer) => {
    router.push(`/admin/review/${customer.id}`);
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      header: "Name",
      render: (customer: Customer) => (
        <div className="font-medium text-gray-900">{customer.name}</div>
      ),
    },
    {
      key: "phone", 
      label: "Phone",
      header: "Phone",
      render: (customer: Customer) => (
        <div className="text-gray-600">{customer.phone}</div>
      ),
    },
    {
      key: "email",
      label: "Email", 
      header: "Email",
      render: (customer: Customer) => (
        <div className="text-gray-600">{customer.email}</div>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted At",
      header: "Submitted At",
      render: (customer: Customer) => (
        <div className="text-gray-600">
          {customer.submittedAt ? new Date(customer.submittedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) : '-'}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      header: "Status",
      render: (customer: Customer) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Under Review
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      header: "Action",
      render: (customer: Customer) => (
        <button
          onClick={() => handleRowClick(customer.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Review Applications</h1>
            <p className="text-gray-600 mt-1">
              {filteredCustomers.length} pengajuan KPR dalam tahap review
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {reviewCustomers.length} Under Review
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
              <option value="name">Nama A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Pengajuan Review
          </h2>
        </div>
        <div className="overflow-hidden">
          <Table
            data={filteredCustomers}
            columns={columns}
            emptyMessage="Tidak ada pengajuan review yang ditemukan"
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">1</span> sampai{" "}
            <span className="font-medium">{filteredCustomers.length}</span> dari{" "}
            <span className="font-medium">{reviewCustomers.length}</span> hasil
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