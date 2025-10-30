'use client';

import { motion, AnimatePresence } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginBlueprint, verifyOtpBlueprint } from '@/services/auth';
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
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [identifier, setIdentifier] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const id = form.get("identifier") as string;
    const password = form.get("password") as string;

    try {
      const result = await loginBlueprint({ identifier: id, password });

      if (result.success) {
        setIdentifier(id); // simpan identifier untuk verify OTP
        setStep("otp");
      } else {
        setError(result.message || "Login gagal.");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

 
  // state untuk OTP
  const [otp, setOtp] = useState("");

  // fungsi submit OTP
  const handleSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await verifyOtpBlueprint({ identifier, otp });
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message || "Kode OTP salah.");
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
            <AnimatePresence mode="wait">
              {step === "login" && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-6"
                >
                  {/* === FORM LOGIN === */}
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
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form
                  key="otp"
                  onSubmit={handleSubmitOtp}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{
                    opacity: 1,
                    x: error ? [0, -8, 8, -6, 6, 0] : 0, // 🌀 shake kalau error
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-6"
                >

                  <div className="w-full text-center">
                    <Label className="block text-center font-medium">Please enter the OTP we sent to your phone.</Label>
                    <div className="mt-3 flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className={
                                error
                                  ? "border-red-500 focus:ring-red-300" // 🔴 kalau OTP salah
                                  : otp.length === 6
                                  ? "border-green-500 focus:ring-green-300" // 🟢 kalau semua digit terisi
                                  : "" // default warna bawaan
                              }
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>

                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2 text-center w-full">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-2/3 bg-[#3FD8D4] hover:bg-[#2BB8B4] text-white font-semibold"
                  >
                    {loading ? "Verifying..." : "Submit"}
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setStep("login")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← Back to Login
                  </Button>

                </motion.form>
              )}

            </AnimatePresence>
          </CardContent>


          <CardFooter className="text-center text-sm text-gray-500">
            © 2025 BNI – Satu Atap Admin Dashboard
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
