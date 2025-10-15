'use client';

export default function HistorySection() {
  const customers = [
    { name: 'Bambang Pamungkas', status: 'Approved' },
    { name: 'Dewi Persik', status: 'Rejected' },
    { name: 'Eko Patrio', status: 'Ongoing Repayment' },
    { name: 'Fitri Carlina', status: 'Approved' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'bg-[#DDEE59]/30 text-[#617400]';
    if (status === 'Rejected') return 'bg-[#757575]/20 text-[#2A2A2A]';
    return 'bg-[#FF8500]/20 text-[#B85F00]';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Application History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{c.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
