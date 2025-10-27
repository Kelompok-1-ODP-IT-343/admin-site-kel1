'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginBlueprint } from '@/services/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const identifier = form.get('identifier') as string;
    const password = form.get('password') as string;

    try {
      const result = await loginBlueprint({ identifier, password });

      if (result.success && result.data?.token) {
        // Simpan token di cookie (1 hari)
        document.cookie = `token=${result.data.token}; path=/; max-age=86400;`;
        router.push('/dashboard');
      } else {
        setError(result.message || 'Failed to login. Please check your credentials.');
      }

    } catch (err: any) {
      console.error('Login error:', err);

      if (err?.response?.status === 401) {
        setError('Invalid credentials. Please check your Developer ID and password.');
      } else if (err?.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network connection.');
      } else {
        setError(
          err?.response?.data?.message ||
            'An error occurred while logging in. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="akun min-h-screen flex">
      {/* === LEFT SIDE === */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <img
          src="/logo-satuatap.png"
          alt="Satu Atap Logo"
          className="w-[500px] h-auto object-contain"
        />
      </div>

      {/* === RIGHT SIDE === */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm shadow-xl border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Login Admin Satu Atap
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Access to dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="example@satuatap.my.id"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="•••••••"
                  required
                  disabled={loading}
                />
              </div>

              {/* === ERROR MESSAGE === */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3FD8D4] hover:bg-[#2BB8B4] text-white font-semibold"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-sm text-gray-500">
            © 2025 BNI – Satu Atap Admin Dashboard
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
