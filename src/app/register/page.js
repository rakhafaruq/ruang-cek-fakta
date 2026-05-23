"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, EyeOff, Eye, RefreshCw, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
    const router = useRouter();

    const [namaLengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (password !== konfirmasiPassword) {
            setErrorMsg("Kata sandi tidak cocok!");
            setLoading(false);
            return;
        }

        try {
            // Register ke Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: namaLengkap,
                    }
                }
            });

            if (error) throw error;

            setSuccessMsg("Pendaftaran berhasil! Silakan periksa email Anda jika diperlukan atau langsung masuk.");
            // Arahkan ke halaman login
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border-t-4 border-t-[#005B5C] border-x border-b border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Buat Akun</h2>
                        <p className="text-sm text-slate-600">Daftar untuk berkontribusi di Ruang Cek Fakta</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="namaLengkap" className="block text-xs font-semibold tracking-widest text-slate-500 mb-1 uppercase">
                                Nama Lengkap
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="namaLengkap"
                                    name="namaLengkap"
                                    type="text"
                                    required
                                    value={namaLengkap}
                                    onChange={(e) => setNamaLengkap(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-0 bg-[#F1F5F9] text-slate-900 rounded-md ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#005B5C] sm:text-sm transition-all placeholder:text-slate-400"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                        </div>

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
                            <label htmlFor="password" className="block text-xs font-semibold tracking-widest text-slate-500 mb-1 uppercase">
                                Kata Sandi
                            </label>
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
                                    placeholder="Minimal 8 karakter"
                                    minLength={8}
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

                        {/* Konfirmasi Kata Sandi */}
                        <div>
                            <label htmlFor="konfirmasiPassword" className="block text-xs font-semibold tracking-widest text-slate-500 mb-1 uppercase">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <RefreshCw className="h-5 w-5" />
                                </div>
                                <input
                                    id="konfirmasiPassword"
                                    name="konfirmasiPassword"
                                    type="password"
                                    required
                                    value={konfirmasiPassword}
                                    onChange={(e) => setKonfirmasiPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-0 bg-[#F1F5F9] text-slate-900 rounded-md ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#005B5C] sm:text-sm transition-all placeholder:text-slate-400"
                                    placeholder="Ketik ulang kata sandi"
                                    minLength={8}
                                />
                            </div>
                        </div>

                        {/* Area Pesan Notifikasi */}
                        {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">{errorMsg}</div>}
                        {successMsg && <div className="p-3 bg-teal-50 border border-teal-200 text-[#005B5C] text-sm rounded-md">{successMsg}</div>}

                        {/* Tombol Daftar */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005B5C] hover:bg-[#004748] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005B5C] transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Memproses..." : "Daftar"}
                                {!loading && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="font-semibold text-[#005B5C] hover:text-[#004748] transition-colors">
                            Masuk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
