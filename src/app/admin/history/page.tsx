"use client";

import { useState } from "react";
import { useKPR } from "@/store/kprStore";
import Table from "@/components/admin/Table";

export default function HistoryPage() {
    const { getByStage } = useKPR();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    const approved = getByStage("approved");
    const rejected = getByStage("rejected");
    
    // Combine approved and rejected with status
    const allHistory = [
        ...approved.map((c) => ({ ...c, status: "Approved" })),
        ...rejected.map((c) => ({ ...c, status: "Rejected" }))
    ];
    
    // Filter by search term and status
    const filteredHistory = allHistory.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.phone.includes(searchTerm);
        
        const matchesStatus = statusFilter === "all" || 
                            customer.status.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

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
            key: "submittedAt",
            label: "Submitted At",
            render: (customer: any) => (
                <div className="text-gray-600">
                    {new Date(customer.submittedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short", 
                        year: "numeric",
                    })}
                </div>
            ),
        },
        {
            key: "processedAt",
            label: "Processed At",
            render: (customer: any) => (
                <div className="text-gray-600">
                    {customer.processedAt ? new Date(customer.processedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short", 
                        year: "numeric",
                    }) : "-"}
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (customer: any) => (
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    customer.status === "Approved" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                }`}>
                    {customer.status}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Application History</h1>
                        <p className="text-gray-600 mt-1">
                            {filteredHistory.length} pengajuan KPR yang telah diproses
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {approved.length} Approved
                        </div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {rejected.length} Rejected
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search History
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
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="all">Semua Status</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Processed</p>
                            <p className="text-2xl font-bold text-gray-900">{allHistory.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                            <p className="text-2xl font-bold text-green-600">
                                {allHistory.length > 0 ? Math.round((approved.length / allHistory.length) * 100) : 0}%
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Loan Value</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    notation: "compact",
                                    maximumFractionDigits: 1,
                                }).format(
                                    approved.reduce((sum, customer) => sum + customer.loanAmount, 0)
                                )}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Riwayat Pengajuan KPR
                    </h2>
                </div>
                <Table
                    data={filteredHistory}
                    columns={columns}
                    emptyMessage="Tidak ada riwayat pengajuan yang ditemukan"
                />
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">1</span> sampai{" "}
                        <span className="font-medium">{filteredHistory.length}</span> dari{" "}
                        <span className="font-medium">{allHistory.length}</span> hasil
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