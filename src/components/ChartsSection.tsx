"use client";

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = {
  blue: "#3FD8D4",
  gray: "#757575",
  orange: "#FF8500",
  lime: "#DDEE59",
  darkBorder: "rgba(255,255,255,0.1)",
  lightBorder: "rgba(117,117,117,0.2)",
};

const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul"];

const growthDemand = months.map((m,i)=>({
  name:m,
  approval:[40,65,85,78,102,130,145][i],
  reject:[10,18,25,32,22,14,20][i],
}));

const outstandingLoan = months.map((m,i)=>({ name:m, value:[180,260,420,500,610,690,770][i] }));

const funnel = [
  { name:"Draft", value:280 },
  { name:"Review", value:190 },
  { name:"Approval", value:140 },
  { name:"Reject", value:30 },
];

const repayment = [
  { name:"On-time", value:72, color:COLORS.lime },
  { name:"Late", value:18, color:COLORS.orange },
  { name:"Default", value:10, color:"#9CA3AF" },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth & Demand */}
      <ChartCard title="Growth & Demand">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={growthDemand}>
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}33`} />
            <XAxis dataKey="name" stroke={COLORS.gray} tick={{ fontSize: 12 }} />
            <YAxis stroke={COLORS.gray} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="approval" name="Approval" stroke={COLORS.orange} fill="url(#gradOrange)" />
            <Area type="monotone" dataKey="reject" name="Reject" stroke={COLORS.blue} fill="url(#gradBlue)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Outstanding Loan */}
      <ChartCard title="Outstanding Loan (Miliar Rupiah)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={outstandingLoan}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}33`} />
            <XAxis dataKey="name" stroke={COLORS.gray} tick={{ fontSize: 12 }} />
            <YAxis stroke={COLORS.gray} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={COLORS.blue} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Funnel */}
      <ChartCard title="Processing Funnel">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={funnel}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}33`} />
            <XAxis dataKey="name" stroke={COLORS.gray} />
            <YAxis stroke={COLORS.gray} />
            <Tooltip />
            <Bar dataKey="value" radius={[10,10,0,0]}>
              <Cell fill={COLORS.blue} />
              <Cell fill={COLORS.orange} />
              <Cell fill={COLORS.lime} />
              <Cell fill={"#9CA3AF"} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Repayment */}
      <ChartCard title="Ongoing Repayment Status">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={repayment}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={2}
              >
                {repayment.map((r, i) => (
                  <Cell key={i} fill={r.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="p-4 space-y-3 text-sm">
            {repayment.map((r) => (
              <li key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: r.color }}
                  />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {r.name}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white dark:bg-neutral-950 dark:border-neutral-800 shadow-sm">
      <div className="px-5 py-3 border-b dark:border-neutral-800">
        <h3
          className="font-semibold text-gray-900 dark:text-white"
          style={{
            fontFamily: "'Inter', sans-serif",
            transition: "color 0.3s ease",
            color:
              typeof window !== "undefined" &&
              document.documentElement.classList.contains("dark")
                ? "#f5f5f5"
                : "#111827", // gray-900 default
          }}
        >
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
