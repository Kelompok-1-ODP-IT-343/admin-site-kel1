// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// export default function Dashboard() {
//   const router = useRouter();
//   const [activeMenu, setActiveMenu] = useState('Home');
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any>(null);

//   const handleReviewClick = (customerName: string) => {
//     setSelectedCustomer(customerName);
//     setShowReviewModal(true);
//   };

//   const handleApprovalAction = (action: string, customerName: string) => {
//     router.push(`/confirm?action=${action}&customer=${encodeURIComponent(customerName)}`);
//   };

//   const handleDetailsClick = (customer: any) => {
//     setSelectedCustomerDetails(customer);
//     setShowDetailsModal(true);
//   };

//   const handleLogout = () => {
//     router.push('/login');
//   };

//   // Stats for Home page — DI-UPGRADE (tetap nilai aslinya)
//   const stats = [
//     { title: 'Draft',   value: 12, color: 'from-[#3FD8D4] to-[#2BB8B4]', accentHex: '#1E90FF' },
//     { title: 'Review',  value: 15, color: 'from-[#FF8500] to-[#E07600]', accentHex: '#C85B00' },
//     { title: 'Approve', value: 7,  color: 'from-[#DDEE59] to-[#C5D649]', accentHex: '#8CA300' },
//     { title: 'Reject',  value: 2,  color: 'from-[#757575] to-[#5A5A5A]', accentHex: '#2E2E2E' },
//   ];

'use client';

import { motion } from 'framer-motion';

export default function HomeSection() {
  const stats = [
    { title: 'Draft', value: 12, color: 'from-[#3FD8D4] to-[#2BB8B4]' },
    { title: 'Review', value: 15, color: 'from-[#FF8500] to-[#E07600]' },
    { title: 'Approve', value: 7, color: 'from-[#DDEE59] to-[#C5D649]' },
    { title: 'Reject', value: 2, color: 'from-[#757575] to-[#5A5A5A]' },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 auto-rows-fr gap-8 h-[calc(100vh-6rem)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => {
        const progress = Math.min((stat.value / 20) * 100, 100);

        const getProgressColor = () => {
          if (stat.value <= 6) return 'bg-green-400';
          if (stat.value <= 14) return 'bg-yellow-400';
          return 'bg-red-500';
        };

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className={`relative bg-gradient-to-br ${stat.color} rounded-3xl p-10 md:p-14 shadow-xl backdrop-blur-md overflow-hidden h-full`}
          >
            {/* Angka besar di kanan */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white drop-shadow 
                            text-7xl md:text-9xl font-extrabold leading-none select-none">
              {stat.value}
            </div>

            {/* Konten kiri */}
            <div className="pr-40 md:pr-56 flex h-full flex-col justify-between">
              <h3
                className="mb-6 drop-shadow"
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  transform: 'translateY(75%)',
                }}
              >
                <span className="block text-[72px] md:text-[76px] leading-[1.1]">
                  {stat.title}
                </span>
              </h3>

              {/* Progress bar */}
              <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`${getProgressColor()} h-3 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
