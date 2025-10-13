'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, Wallet, Clock, Users } from 'lucide-react';

const COLORS = {
  blue: '#3FD8D4',
  gray: '#757575',
  orange: '#FF8500',
  lime: '#DDEE59',
  cardBorder: 'rgba(117,117,117,0.2)',
} as const;

// Dummy data (bisa sambung ke API kamu)
const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul'];
const growthDemand = months.map((m,i)=>({
  name:m,
  approval:[40,65,85,78,102,130,145][i],
  reject:[10,18,25,32,22,14,20][i],
}));
const outstandingLoan = months.map((m,i)=>({ name:m, value:[180,260,420,500,610,690,770][i] }));
const funnel = [
  { name:'Draft', value:280 },
  { name:'Review', value:190 },
  { name:'Approval', value:140 },
  { name:'Reject', value:30 },
];
const repayment = [
  { name:'On-time', value:72, color:COLORS.lime },
  { name:'Late', value:18, color:COLORS.orange },
  { name:'Default', value:10, color:'#9CA3AF' },
];

const kFormat = (n:number)=> new Intl.NumberFormat('id-ID',{notation:'compact'}).format(n);
const rp = (n:number)=> `Rp${n.toLocaleString('id-ID')}`;

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<'6m'|'12m'>('6m');

  const kpi = useMemo(()=>({
    demand: growthDemand.at(-1)!.approval + growthDemand.at(-1)!.reject,
    outstanding: outstandingLoan.at(-1)!.value * 1_000_000_000,
    approvalRate: Math.round(
      (growthDemand.reduce((s,d)=>s+d.approval,0) /
       growthDemand.reduce((s,d)=>s+d.approval+d.reject,0)) * 100
    ),
    activeBorrowers: 8150,
  }),[]);

  return (
    <div className="space-y-6">
      {/* KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Demand" value={kFormat(kpi.demand)} subtitle="(Approval + Reject)" icon={<TrendingUp/>}/>
        <KpiCard title="Outstanding Loan" value={rp(kpi.outstanding)} subtitle="Miliar Rupiah" icon={<Wallet/>}/>
        <KpiCard title="Approval Rate" value={`${kpi.approvalRate}%`} subtitle="This period" icon={<Clock/>}/>
        <KpiCard title="Active Borrowers" value={kFormat(kpi.activeBorrowers)} subtitle="Nasabah aktif" icon={<Users/>}/>
      </section>

      {/* Toggle range (opsional) */}
      <section className="flex justify-between items-center">
        <h2 className="text-black font-semibold">Overview</h2>
        <div className="inline-flex rounded-lg overflow-hidden border" style={{borderColor:COLORS.cardBorder}}>
          {(['6m','12m'] as const).map(r=>(
            <button key={r} onClick={()=>setRange(r)}
              className={`px-3 py-1 text-sm ${range===r?'text-white':''}`}
              style={{background: range===r ? COLORS.blue : 'transparent'}}>
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Growth & Demand">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthDemand} margin={{left:4,right:8,top:8,bottom:0}}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}44`} />
                <XAxis dataKey="name" stroke={COLORS.gray} tick={{fontSize:12}}/>
                <YAxis stroke={COLORS.gray} tick={{fontSize:12}}/>
                <Tooltip formatter={(v:number)=>v.toLocaleString('id-ID')} />
                <Area type="monotone" dataKey="approval" name="Approval" stroke={COLORS.orange} fill="url(#gradOrange)" />
                <Area type="monotone" dataKey="reject"   name="Reject"   stroke={COLORS.blue}   fill="url(#gradBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Outstanding Loan (Miliar Rupiah)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outstandingLoan}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}44`} />
                <XAxis dataKey="name" stroke={COLORS.gray} tick={{fontSize:12}}/>
                <YAxis stroke={COLORS.gray} tick={{fontSize:12}}/>
                <Tooltip formatter={(v:number)=>v.toLocaleString('id-ID')} />
                <Line type="monotone" dataKey="value" stroke={COLORS.blue} strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Processing Funnel">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.gray}44`} />
                <XAxis dataKey="name" stroke={COLORS.gray}/>
                <YAxis stroke={COLORS.gray}/>
                <Tooltip formatter={(v:number)=>v.toLocaleString('id-ID')} />
                <Bar dataKey="value" radius={[10,10,0,0]}>
                  <Cell fill={COLORS.blue}/><Cell fill={COLORS.orange}/><Cell fill={COLORS.lime}/><Cell fill={'#9CA3AF'}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Ongoing Repayment Status">
          <div className="h-64 grid grid-cols-1 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={repayment} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} strokeWidth={2}>
                    {repayment.map((r,i)=><Cell key={i} fill={r.color} />)}
                  </Pie>
                  <Legend/><Tooltip formatter={(v:number)=>`${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="p-4 space-y-3 text-sm">
              {repayment.map(r=>(
                <li key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{background:r.color}}/>
                    <span className="text-black font-medium">{r.name}</span>
                  </div>
                  <span>{r.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Card({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border shadow-sm" style={{ borderColor: COLORS.cardBorder }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: COLORS.cardBorder }}>
        <h3 className="text-black font-semibold">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function KpiCard({ title, value, subtitle, icon }:{
  title:string; value:string; subtitle?:string; icon?:React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border p-4 flex items-center gap-4 shadow-sm" style={{ borderColor: COLORS.cardBorder }}>
      <div className="h-10 w-10 rounded-xl grid place-content-center text-white" style={{ background: COLORS.blue }}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase">{title}</p>
        <p className="text-black text-xl font-semibold leading-6">{value}</p>
        {subtitle && <p className="text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}
