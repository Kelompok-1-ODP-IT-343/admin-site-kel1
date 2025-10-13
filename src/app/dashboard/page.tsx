'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function Dashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('Home');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any>(null);

  const handleReviewClick = (customerName: string) => {
    setSelectedCustomer(customerName);
    setShowReviewModal(true);
  };

  const handleApprovalAction = (action: string, customerName: string) => {
    router.push(`/confirm?action=${action}&customer=${encodeURIComponent(customerName)}`);
  };

  const handleDetailsClick = (customer: any) => {
    setSelectedCustomerDetails(customer);
    setShowDetailsModal(true);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const menuItems = [
    { name: 'Home',      icon: '/home.png' },
    { name: 'Dashboard', icon: '/dashboard.png' },
    { name: 'Draft',     icon: '/draft.png' },
    { name: 'Review',    icon: '/review.png' },
    { name: 'Approval',  icon: '/approval.png' },
    { name: 'History',   icon: '/history.png' },
  ];

  // Dummy data for charts (tetap dipertahankan)
  const growthData = [
    { month: 'Jan', approval: 120, reject: 30 },
    { month: 'Feb', approval: 140, reject: 25 },
    { month: 'Mar', approval: 160, reject: 35 },
    { month: 'Apr', approval: 150, reject: 40 },
    { month: 'May', approval: 180, reject: 30 },
    { month: 'Jun', approval: 200, reject: 25 }
  ];

  const loanData = [
    { month: 'Jan', amount: 500 },
    { month: 'Feb', amount: 600 },
    { month: 'Mar', amount: 750 },
    { month: 'Apr', amount: 850 },
    { month: 'May', amount: 900 },
    { month: 'Jun', amount: 950 }
  ];

  const funnelData = [
    { stage: 'Draft', count: 300, color: '#3FD8D4' },
    { stage: 'Review', count: 200, color: '#FF8500' },
    { stage: 'Approval', count: 150, color: '#DDEE59' },
    { stage: 'Reject', count: 50, color: '#757575' }
  ];

  const repaymentData = [
    { status: 'On-time', percentage: 70, color: '#DDEE59' },
    { status: 'Late', percentage: 20, color: '#FF8500' },
    { status: 'Default', percentage: 10, color: '#757575' }
  ];

  // Stats for Home page — DI-UPGRADE (tetap nilai aslinya)
  const stats = [
    { title: 'Draft',   value: 12, color: 'from-[#3FD8D4] to-[#2BB8B4]', accentHex: '#1E90FF' },
    { title: 'Review',  value: 15, color: 'from-[#FF8500] to-[#E07600]', accentHex: '#C85B00' },
    { title: 'Approve', value: 7,  color: 'from-[#DDEE59] to-[#C5D649]', accentHex: '#8CA300' },
    { title: 'Reject',  value: 2,  color: 'from-[#757575] to-[#5A5A5A]', accentHex: '#2E2E2E' },
  ];


  const renderContent = () => {
    switch (activeMenu) {
      case 'Home':
        return (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 auto-rows-fr gap-8 h-[calc(100vh-6rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {stats.map((stat, index) => {
              // Hitung progress (maksimal 20 = 100%)
              const progress = Math.min((stat.value / 20) * 100, 100);
  
        // Warna progress berdasarkan value
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
                  style={{ color: '#fff', fontWeight: 800, letterSpacing: '0.02em', transform: 'translateY(75%)'}}
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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 auto-rows-fr gap-8 h-[calc(100vh-6rem)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => {
        // --- Progress dihitung berdasarkan value (0-20) ---
        const progress = Math.min((stat.value / 20) * 100, 100);

        // --- Warna progress sesuai value ---
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
            className={`relative bg-gradient-to-br ${stat.color} rounded-3xl p-8 md:p-10 shadow-xl backdrop-blur-md overflow-hidden h-full`}
          >
            {/* ANGKA BESAR DI KANAN */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white drop-shadow 
                            text-6xl md:text-8xl font-extrabold leading-none select-none">
              {stat.value}
            </div>

            {/* KONTEN KIRI */}
            <div className="pr-32 md:pr-48 flex h-full flex-col justify-between">
              <h3 className="text-white drop-shadow text-2xl md:text-4xl font-bold">
                {stat.title}
              </h3>

              {/* PROGRESS BAR DINAMIS */}
              <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden mt-4">
                <motion.div
                  className={`${getProgressColor()} h-2 rounded-full`}
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

      case 'Dashboard':
        return <AnalyticsDashboard />;

      case 'Draft':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Header with Search and Sort */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FD8D4] focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Newest</option>
                    <option>Name</option>
                    <option>Status</option>
                    <option>Date</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Customer Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Review</th>
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:text-black">
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">Zhang Ahong</td>
                    <td className="py-4 px-4">081277898456</td>
                    <td className="py-4 px-4">jane@microsoft.com</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleReviewClick('Zhang Ahong')}
                        className="relative bg-gradient-to-r from-[#FFB800] to-[#FF8500] text-black px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 flex items-center justify-center space-x-2 group"
                      >
                        <span>Review</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">Melva Chipmunk</td>
                    <td className="py-4 px-4">081277898456</td>
                    <td className="py-4 px-4">jane@microsoft.com</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleReviewClick('Zhang Ahong')}
                        className="relative bg-gradient-to-r from-[#FFB800] to-[#FF8500] text-black px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 flex items-center justify-center space-x-2 group"
                      >
                        <span>Review</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">Cecilion</td>
                    <td className="py-4 px-4">082147896644</td>
                    <td className="py-4 px-4">ronald@adobe.com</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleReviewClick('Zhang Ahong')}
                        className="relative bg-gradient-to-r from-[#FFB800] to-[#FF8500] text-black px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 flex items-center justify-center space-x-2 group"
                      >
                        <span>Review</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">Hotman Paris</td>
                    <td className="py-4 px-4">087899446884</td>
                    <td className="py-4 px-4">marvin@tesla.com</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleReviewClick('Zhang Ahong')}
                        className="relative bg-gradient-to-r from-[#FFB800] to-[#FF8500] text-black px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 flex items-center justify-center space-x-2 group"
                      >
                        <span>Review</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination and Data Info */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing data 1 to 8 of 266K entries
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  &lt;
                </button>
                <button className="px-3 py-2 bg-blue-500 text-white rounded">1</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">4</button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">40</button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  &gt;
                </button>
              </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Review Application</h2>
                    <button 
                      onClick={() => setShowReviewModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <p className="text-gray-900">{selectedCustomer}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <p className="text-gray-900">081277898456</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-gray-900">jane@microsoft.com</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <p className="text-gray-900">15 January 1990</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                        <p className="text-gray-900">3201234567890123</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                        <p className="text-gray-900">Software Engineer</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                        <p className="text-gray-900">Rp 15,000,000</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                        <p className="text-gray-900">Rp 500,000,000</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <p className="text-gray-900">Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Details</label>
                      <p className="text-gray-900">Rumah Tipe 45, Luas Tanah 72m², Luas Bangunan 45m²</p>
                      <p className="text-gray-600 text-sm">Lokasi: Perumahan Green Valley, Bekasi</p>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <button 
                        onClick={() => setShowReviewModal(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button 
                        onClick={() => setShowReviewModal(false)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Done Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

    case 'Review':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Header with Search and Sort */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FD8D4] focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Newest</option>
                  <option>Name</option>
                  <option>Status</option>
                  <option>Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Review</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">Baharuddin</td>
                  <td className="py-4 px-4 text-black">081277898456</td>
                  <td className="py-4 px-4 text-black">jane@microsoft.com</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#FFF7E6] text-[#FF8500] font-semibold px-4 py-2 rounded-full shadow-sm border border-[#FFD599]">
                      <svg
                        className="w-4 h-4 animate-spin text-[#FF8500]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <span>Under Review</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">Zulkarnain</td>
                  <td className="py-4 px-4 text-black">081277898456</td>
                  <td className="py-4 px-4 text-black">jane@microsoft.com</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#FFF7E6] text-[#FF8500] font-semibold px-4 py-2 rounded-full shadow-sm border border-[#FFD599]">
                      <svg
                        className="w-4 h-4 animate-spin text-[#FF8500]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <span>Under Review</span>
                    </div>
                </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">Lutpi</td>
                  <td className="py-4 px-4 text-black">082147896644</td>
                  <td className="py-4 px-4 text-black">ronald@adobe.com</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#FFF7E6] text-[#FF8500] font-semibold px-4 py-2 rounded-full shadow-sm border border-[#FFD599]">
                      <svg
                        className="w-4 h-4 animate-spin text-[#FF8500]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <span>Under Review</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">Kusumo</td>
                  <td className="py-4 px-4 text-black">087899446884</td>
                  <td className="py-4 px-4 text-black">marvin@tesla.com</td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#FFF7E6] text-[#FF8500] font-semibold px-4 py-2 rounded-full shadow-sm border border-[#FFD599]">
                      <svg
                        className="w-4 h-4 animate-spin text-[#FF8500]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <span>Under Review</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination and Data Info */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing data 1 to 8 of 256K entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                &lt;
              </button>
              <button className="px-3 py-2 bg-blue-500 text-white rounded">1</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">4</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">40</button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                &gt;
              </button>
            </div>
          </div>
        </div>
      );


      case 'Approval':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Header with Search and Sort */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Newest</option>
                    <option>Name</option>
                    <option>Status</option>
                    <option>Date</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Customer Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-black">Cecilia Depok</td>
                    <td className="py-4 px-4 text-black">081278984567</td>
                    <td className="py-4 px-4 text-black">siti@microsoft.com</td>
                    <td className="py-4 px-4">
                    <button
                      onClick={() => router.push('/dashboard/simulate')}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#FF8500] to-[#DDEE59] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4h16v16H4V4zm4 4h8m-8 4h4"
                        />
                      </svg>
                      <span>Simulate</span>
                    </button>

                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-black">Chipmunk Melva</td>
                    <td className="py-4 px-4 text-black">081278984568</td>
                    <td className="py-4 px-4 text-black">ahmad@microsoft.com</td>
                    <td className="py-4 px-4">
                    <button
                      onClick={() => router.push('/dashboard/simulate')}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#FF8500] to-[#DDEE59] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4h16v16H4V4zm4 4h8m-8 4h4"
                        />
                      </svg>
                      <span>Simulate</span>
                    </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-black">Theodore Natania</td>
                    <td className="py-4 px-4 text-black">082147896543</td>
                    <td className="py-4 px-4 text-black">raisa@adobe.com</td>
                    <td className="py-4 px-4">
                    <button
                      onClick={() => router.push('/dashboard/simulate')}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#FF8500] to-[#DDEE59] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4h16v16H4V4zm4 4h8m-8 4h4"
                        />
                      </svg>
                      <span>Simulate</span>
                    </button>

                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-black">Lutpi Aipibi</td>
                    <td className="py-4 px-4 text-black">087898446884</td>
                    <td className="py-4 px-4 text-black">tulus@tesla.com</td>
                    <td className="py-4 px-4">
                    <button
                      onClick={() => router.push('/dashboard/simulate')}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#FF8500] to-[#DDEE59] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4h16v16H4V4zm4 4h8m-8 4h4"
                        />
                      </svg>
                      <span>Simulate</span>
                    </button>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination and Data Info */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing data 1 to 4 of 256K entries
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">&lt;</button>
                <button className="px-3 py-2 bg-blue-500 text-white rounded">1</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">4</button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">40</button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">&gt;</button>
              </div>
            </div>
          </div>
        );

        case 'History':
          return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* ===== Stats Cards ===== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Customers */}
                <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform duration-200 hover:-translate-y-0.5">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(48,140,255,1) 0%, rgba(16,86,255,1) 100%)',
                    }}
                  />
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Customers</p>
                      <p className="mt-2 text-4xl font-extrabold drop-shadow-sm">1,247</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                        </svg>
                        <span className="font-medium">+8.2% MoM</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
                      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-3/4 rounded-full bg-white/90" />
                  </div>
                </div>

                {/* Approved */}
                <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform duration-200 hover:-translate-y-0.5">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(16,185,129,1) 0%, rgba(5,122,85,1) 100%)',
                    }}
                  />
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Approved</p>
                      <p className="mt-2 text-4xl font-extrabold drop-shadow-sm">892</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                        </svg>
                        <span className="font-medium">+3.4% WoW</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
                      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[60%] rounded-full bg-white/90" />
                  </div>
                </div>

                {/* Ongoing Loan Repayment */}
                <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-transform duration-200 hover:-translate-y-0.5">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,133,0,1) 0%, rgba(234,88,12,1) 100%)',
                    }}
                  />
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Ongoing Loan Repayment</p>
                      <p className="mt-2 text-4xl font-extrabold drop-shadow-sm">234</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="font-medium">−1.1% WoW</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
                      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[30%] rounded-full bg-white/90" />
                  </div>
                </div>
              </div>

              {/* ===== Header with Search and Sort ===== */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FD8D4] focus:border-transparent shadow-sm"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3FD8D4] shadow-sm">
                      <option>Newest</option>
                      <option>Name</option>
                      <option>Status</option>
                      <option>Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ===== Table ===== */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: 'Bambang Pamungkas', phone: '081234567890', email: 'bambang@gmail.com', status: 'Approved', date: '2024-01-15', loanAmount: 'Rp 500,000,000', property: 'Rumah Type 70', address: 'Jakarta Selatan' },
                      { name: 'Dewi Persik', phone: '081234567891', email: 'dewi@gmail.com', status: 'Rejected', date: '2024-01-14', loanAmount: 'Rp 300,000,000', property: 'Rumah Type 45', address: 'Bekasi' },
                      { name: 'Eko Patrio', phone: '081234567892', email: 'eko@gmail.com', status: 'Ongoing Repayment', date: '2024-01-13', loanAmount: 'Rp 750,000,000', property: 'Rumah Type 90', address: 'Tangerang' },
                      { name: 'Fitri Carlina', phone: '081234567893', email: 'fitri@gmail.com', status: 'Approved', date: '2024-01-12', loanAmount: 'Rp 400,000,000', property: 'Rumah Type 60', address: 'Bogor' },
                      { name: 'Gilang Dirga', phone: '081234567894', email: 'gilang@gmail.com', status: 'Rejected', date: '2024-01-11', loanAmount: 'Rp 600,000,000', property: 'Rumah Type 80', address: 'Depok' }
                    ].map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50/70">
                        <td className="px-4 py-4 text-gray-800">{customer.name}</td>
                        <td className="px-4 py-4 text-gray-800">{customer.phone}</td>
                        <td className="px-4 py-4 text-gray-800">{customer.email}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium
                              ${
                                customer.status === 'Approved'
                                  ? 'bg-[#DDEE59]/30 text-[#617400]'
                                  : customer.status === 'Rejected'
                                  ? 'bg-[#757575]/20 text-[#2A2A2A]'
                                  : 'bg-[#FF8500]/20 text-[#B85F00]'
                              }`}
                          >
                            {customer.status === 'Approved' ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                              </svg>
                            ) : customer.status === 'Rejected' ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                              </svg>
                            )}
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleDetailsClick(customer)}
                            className="rounded-lg bg-[#3FD8D4] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-cyan-500"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== Pagination & Info ===== */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">Showing data 1 to 5 of 1,247 entries</div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-700">&lt;</button>
                  <button className="rounded-lg bg-[#3FD8D4] px-3 py-2 text-white shadow">1</button>
                  <button className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">2</button>
                  <button className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">3</button>
                  <button className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">4</button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">249</button>
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-700">&gt;</button>
                </div>
              </div>

              {/* ===== Details Modal ===== */}
              {showDetailsModal && selectedCustomerDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-500 transition-colors hover:text-gray-700"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                          <p className="text-gray-900">{selectedCustomerDetails.name}</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                          <p className="text-gray-900">{selectedCustomerDetails.phone}</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{selectedCustomerDetails.email}</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium
                              ${
                                selectedCustomerDetails.status === 'Approved'
                                  ? 'bg-[#DDEE59]/30 text-[#617400]'
                                  : selectedCustomerDetails.status === 'Rejected'
                                  ? 'bg-[#757575]/20 text-[#2A2A2A]'
                                  : 'bg-[#FF8500]/20 text-[#B85F00]'
                              }`}
                          >
                            {selectedCustomerDetails.status}
                          </span>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Loan Amount</label>
                          <p className="text-gray-900">{selectedCustomerDetails.loanAmount}</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Property Type</label>
                          <p className="text-gray-900">{selectedCustomerDetails.property}</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                        <p className="text-gray-900">{selectedCustomerDetails.address}</p>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setShowDetailsModal(false)}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

      default:
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Satu Atap</h2>
            <p className="text-gray-600">Pilih menu di sidebar untuk melihat konten yang berbeda.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-r-3xl p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="/sidebar_satuatap.png"
            alt="Satu Atap Logo"
            className="w-40 h-auto object-contain"
          />
        </div>

        {/* Welcome Message */}
        <div className="mb-8 bg-gray-100 rounded-lg p-3">
          <span className="text-gray-600 text-sm">Welcome, </span>
          <span className="text-teal-600 font-semibold">Admin Ahong</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeMenu === item.name
                  ? 'bg-teal-100 text-teal-700 border-l-4 border-teal-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <img
                src={item.icon}
                alt={`${item.name} icon`}
                className="w-5 h-5 object-contain"
              />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout pindah ke sidebar */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header (tanpa logout, sesuai permintaan) */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-600">
            <span className="font-medium">Friday | 3 October 2025 | 12:00:00</span>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
}
