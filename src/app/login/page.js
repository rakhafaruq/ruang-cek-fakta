"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Komponen dalam yang menggunakan useSearchParams (harus dibungkus Suspense)
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ambil callbackUrl dari query string jika ada (misal dari redirect proxy/auth guard)
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setSuccessMsg("Berhasil masuk! Mengalihkan...");
            // Kembalikan ke halaman asal (callbackUrl) setelah login berhasil
            router.push(callbackUrl);

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border-t-4 border-t-[#005B5C] border-x border-b border-slate-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Masuk ke Akun Anda</h2>
                <p className="text-sm text-slate-600">Masuk untuk melanjutkan ke Ruang Cek Fakta</p>
            </div>

            {/* Notifikasi jika diarahkan dari halaman yang membutuhkan login */}
            {callbackUrl !== "/" && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Silakan masuk terlebih dahulu untuk mengakses halaman tersebut.</span>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold tracking-widest text-slate-500 mb-1 uppercase">
                        Email
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-5 w-5" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border-0 bg-[#F1F5F9] text-slate-900 rounded-md ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#005B5C] sm:text-sm transition-all placeholder:text-slate-400"
                            placeholder="nama@email.com"
                        />
                    </div>
                </div>

                {/* Kata Sandi */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-xs font-semibold tracking-widest text-slate-500 uppercase">
                            Kata Sandi
                        </label>
                        <Link href="/forgot-password" className="text-xs font-medium text-[#005B5C] hover:text-[#004748] transition-colors">
                            Lupa Kata Sandi?
                        </Link>
                    </div>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-10 py-3 border-0 bg-[#F1F5F9] text-slate-900 rounded-md ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#005B5C] sm:text-sm transition-all placeholder:text-slate-400"
                            placeholder="Masukkan kata sandi"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Area Pesan Notifikasi */}
                {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">{errorMsg}</div>}
                {successMsg && <div className="p-3 bg-teal-50 border border-teal-200 text-[#005B5C] text-sm rounded-md">{successMsg}</div>}

                {/* Tombol Masuk */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005B5C] hover:bg-[#004748] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005B5C] transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
                Belum punya akun?{" "}
                <Link href="/register" className="font-semibold text-[#005B5C] hover:text-[#004748] transition-colors">
                    Daftar
                </Link>
            </div>
        </div>
    );
}

// Fallback skeleton saat Suspense loading
function LoginSkeleton() {
    return (
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border-t-4 border-t-[#005B5C] border-x border-b border-slate-100 animate-pulse">
            <div className="text-center mb-8">
                <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-64 mx-auto"></div>
            </div>
            <div className="space-y-5">
                <div className="h-12 bg-slate-100 rounded-md"></div>
                <div className="h-12 bg-slate-100 rounded-md"></div>
                <div className="h-12 bg-[#005B5C]/20 rounded-md"></div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Suspense boundary wajib karena LoginForm menggunakan useSearchParams() */}
                <Suspense fallback={<LoginSkeleton />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
