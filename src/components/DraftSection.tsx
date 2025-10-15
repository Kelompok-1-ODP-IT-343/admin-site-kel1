'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DraftSectionProps {
  onReviewClick: (customerName: string) => void;
}

export default function DraftSection({ onReviewClick }: DraftSectionProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const handleReviewClick = (customer: string) => {
    setSelectedCustomer(customer);
    setShowReviewModal(true);
    onReviewClick(customer);
  };

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
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
            {['Zhang Ahong', 'Melva Chipmunk', 'Cecilion', 'Hotman Paris'].map((name) => (
              <tr key={name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">{name}</td>
                <td className="py-4 px-4">081277898456</td>
                <td className="py-4 px-4">customer@example.com</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleReviewClick(name)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Review */}
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
            <p className="text-gray-700 mb-4">Customer: {selectedCustomer}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Done Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
