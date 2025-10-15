'use client';

import { useRouter } from 'next/navigation';
import { loginBlueprint } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();

  const handleDemoLogin = async () => {
    // Tanpa mengubah UI, gunakan blueprint login dan lanjut ke dashboard
    const result = await loginBlueprint({ username: 'admin', password: 'admin' });
    if (result.success) {
      router.push('/dashboard');
    } else {
      // tidak mengubah UI; jika gagal cukup log error
      console.error('Login gagal:', result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Full Logo Section */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <img
          src="/logo-satuatap.png"
          alt="Satu Atap Logo"
          className="w-[500px] h-auto object-contain" // ukuran besar, bisa disesuaikan
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#3FD8D4] mb-8 text-center">
              Login Admin Satu Atap
            </h2>

            <div className="space-y-6">
              <button
                onClick={handleDemoLogin}
                className="w-full bg-[#3FD8D4] text-white py-3 px-4 rounded-lg hover:bg-[#2BB8B4] transition-colors font-semibold text-lg"
              >
                Demo Login
              </button>

              <p className="text-sm text-[#757575] text-center">
                Klik tombol di atas untuk masuk ke dashboard demo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
