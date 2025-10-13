"use client";

import { useKPR } from "@/store/kprStore";

function MiniLineChart({ title, data }: { title: string; data: number[] }) {
    const maxVal = Math.max(...data);
    const normalizedData = data.map(val => (val / maxVal) * 100);
    const path = normalizedData.map((y, i) => `${i === 0 ? "M" : "L"}${i * 40 + 20} ${120 - y}` ).join(" ");
    
    return (
        <svg viewBox="0 0 240 140" className="w-full h-40">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.1"/>
                </linearGradient>
            </defs>
            <rect x="0" y="0" width="240" height="140" rx="10" className="fill-gray-50 stroke-gray-200"/>
            <path d={path} className="stroke-teal-600 fill-none" strokeWidth={3}/>
            <path d={`${path} L${(data.length - 1) * 40 + 20} 120 L20 120 Z`} fill="url(#lineGradient)"/>
            {normalizedData.map((y, i) => (
                <circle key={i} cx={i * 40 + 20} cy={120 - y} r="4" className="fill-teal-600"/>
            ))}
        </svg>
    );
}

function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const maxVal = Math.max(...data.map(d => d.value));
    
    return (
        <svg viewBox="0 0 280 160" className="w-full h-44">
            <rect x="0" y="0" width="280" height="160" rx="10" className="fill-gray-50 stroke-gray-200"/>
            {data.map((item, i) => {
                const barHeight = (item.value / maxVal) * 100;
                return (
                    <g key={i}>
                        <rect 
                            x={20 + i * 60} 
                            y={140 - barHeight} 
                            width="45" 
                            height={barHeight} 
                            className={`fill-${item.color}-500`}
                            rx="4"
                        />
                        <text 
                            x={42.5 + i * 60} 
                            y={155} 
                            textAnchor="middle" 
                            className="fill-gray-600 text-[10px] font-medium"
                        >
                            {item.label}
                        </text>
                        <text 
                            x={42.5 + i * 60} 
                            y={135 - barHeight} 
                            textAnchor="middle" 
                            className="fill-gray-700 text-[10px] font-bold"
                        >
                            {item.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function MiniDonut({ approved, rejected, total }: { approved: number; rejected: number; total: number }) {
    const approvedPercent = total > 0 ? (approved / total) * 100 : 0;
    const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;
    const pendingPercent = 100 - approvedPercent - rejectedPercent;
    
    // Calculate stroke-dasharray for circles
    const circumference = 2 * Math.PI * 16;
    const approvedDash = (approvedPercent / 100) * circumference;
    const rejectedDash = (rejectedPercent / 100) * circumference;
    const pendingDash = (pendingPercent / 100) * circumference;
    
    return (
        <div className="relative w-44 h-44">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                
                {/* Approved segment */}
                <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke="#16a34a" 
                    strokeWidth="4" 
                    strokeDasharray={`${approvedDash} ${circumference - approvedDash}`}
                    strokeDashoffset="0"
                />
                
                {/* Rejected segment */}
                <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="4" 
                    strokeDasharray={`${rejectedDash} ${circumference - rejectedDash}`}
                    strokeDashoffset={-approvedDash}
                />
                
                {/* Pending segment */}
                <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="4" 
                    strokeDasharray={`${pendingDash} ${circumference - pendingDash}`}
                    strokeDashoffset={-(approvedDash + rejectedDash)}
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Status Distribution</div>
                    <div className="text-sm font-semibold text-gray-700">
                        <div className="text-green-600">{approvedPercent.toFixed(0)}% Approved</div>
                        <div className="text-red-600">{rejectedPercent.toFixed(0)}% Rejected</div>
                        <div className="text-amber-600">{pendingPercent.toFixed(0)}% Pending</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { byStage, count } = useKPR();
    
    // Get real data from store
    const draftCount = count("draft");
    const reviewCount = count("review");
    const approvalCount = count("approval");
    const approvedCount = count("approved");
    const rejectedCount = count("rejected");
    
    // Sample data for growth chart (could be enhanced with real historical data)
    const growthData = [20, 35, 45, 52, 68, 75];
    const loanData = [100, 120, 140, 135, 160, 180];
    
    // Bar chart data with real counts
    const funnelData = [
        { label: "Draft", value: draftCount, color: "blue" },
        { label: "Review", value: reviewCount, color: "yellow" },
        { label: "Approval", value: approvalCount, color: "green" },
        { label: "Rejected", value: rejectedCount, color: "red" }
    ];
    
    const totalProcessed = approvedCount + rejectedCount;
    const totalPending = draftCount + reviewCount + approvalCount;
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard Analytics</h1>
                        <p className="text-gray-600 mt-1">
                            Overview pengajuan KPR dan performa sistem
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {totalPending + totalProcessed} Total Applications
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="font-semibold text-teal-800 mb-4 text-center">Growth & Demand Trend</div>
                    <MiniLineChart title="Growth" data={growthData} />
                    <div className="mt-3 text-center text-sm text-gray-600">
                        Monthly application growth over 6 months
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="font-semibold text-teal-800 mb-4 text-center">Outstanding Loan Volume</div>
                    <MiniLineChart title="Loans" data={loanData} />
                    <div className="mt-3 text-center text-sm text-gray-600">
                        Loan disbursement trend (in millions IDR)
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="font-semibold text-teal-800 mb-4 text-center">Processing Funnel</div>
                    <MiniBarChart data={funnelData} />
                    <div className="mt-3 text-center text-sm text-gray-600">
                        Current applications by stage
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="font-semibold text-teal-800 mb-4 text-center">Application Status</div>
                    <div className="grid place-items-center">
                        <MiniDonut 
                            approved={approvedCount} 
                            rejected={rejectedCount} 
                            total={totalProcessed + totalPending}
                        />
                    </div>
                    <div className="mt-3 text-center text-sm text-gray-600">
                        Distribution of all applications
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{draftCount}</div>
                        <div className="text-sm text-blue-700">Draft Applications</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reviewCount}</div>
                        <div className="text-sm text-yellow-700">Under Review</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                        <div className="text-sm text-green-700">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                        <div className="text-sm text-red-700">Rejected</div>
                    </div>
                </div>
            </div>
        </div>
    );  
}