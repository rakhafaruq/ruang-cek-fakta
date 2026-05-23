"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setErrorMsg("Kata sandi harus terdiri dari minimal 6 karakter");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccessMsg("Kata sandi berhasil diperbarui! Mengalihkan ke halaman login...");
            
            // Redirect ke halaman login setelah 3 detik
            setTimeout(() => {
                router.push("/login");
            }, 3000);

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
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Perbarui Kata Sandi</h2>
                        <p className="text-sm text-slate-600">Masukkan kata sandi baru untuk akun Anda</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleUpdatePassword}>
                        {/* Kata Sandi Baru */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold tracking-widest text-slate-500 mb-1 uppercase">
                                Kata Sandi Baru
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
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border-0 bg-[#F1F5F9] text-slate-900 rounded-md ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#005B5C] sm:text-sm transition-all placeholder:text-slate-400"
                                    placeholder="Minimal 6 karakter"
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

                        {/* Tombol Perbarui */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !!successMsg}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005B5C] hover:bg-[#004748] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005B5C] transition-colors ${loading || successMsg ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Memproses..." : "Perbarui Kata Sandi"}
                                {!loading && !successMsg && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
