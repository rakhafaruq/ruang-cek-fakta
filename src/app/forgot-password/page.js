"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccessMsg("Tautan reset kata sandi telah dikirim. Silakan periksa kotak masuk atau folder spam email Anda.");
            setEmail("");
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Lupa Kata Sandi</h2>
                        <p className="text-sm text-slate-600">Masukkan email Anda untuk menerima tautan reset kata sandi</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleResetPassword}>
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

                        {/* Area Pesan Notifikasi */}
                        {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">{errorMsg}</div>}
                        {successMsg && <div className="p-3 bg-teal-50 border border-teal-200 text-[#005B5C] text-sm rounded-md">{successMsg}</div>}

                        {/* Tombol Kirim Tautan */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005B5C] hover:bg-[#004748] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005B5C] transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Mengirim..." : "Kirim Tautan Reset"}
                                {!loading && <ArrowRight className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
