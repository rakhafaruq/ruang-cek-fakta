"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // 1. Periksa sesi pengguna saat pertama kali Navbar dimuat
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        checkUser();

        // 2. Dengarkan perubahan status auth secara real-time (Login/Logout)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-surface/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Bagian Kiri: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-slate-900 tracking-wide font-sans">
                            Ruang<span className="text-teal-700">CekFakta</span>
                        </Link>
                    </div>

                    {/* Bagian Tengah: Menu Navigasi */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-slate-900 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Beranda
                            </Link>
                            <Link href="/literasi" className="text-slate-900 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Literasi
                            </Link>
                            <Link href="/tentang-kami" className="text-slate-900 hover:text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Tentang Kami
                            </Link>
                        </div>
                    </div>

                    {/* Bagian Kanan: Kondisional Auth (Login / Logout + Profile) */}
                    <div className="flex items-center gap-4">
                        <Link href="/lapor" className="hidden md:block border border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                            Lapor Hoaks
                        </Link>

                        {user ? (
                            // Tampilan JIKA USER SUDAH LOGIN
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-[#005B5C] cursor-pointer">
                                        <img 
                                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || user.email.split("@")[0]}&background=005B5C&color=fff`} 
                                            alt="User Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200 z-50">
                                        <div className="px-4 py-2 border-b border-slate-200">
                                            <p className="text-sm text-slate-900 font-semibold truncate">{user.user_metadata?.full_name || user.email.split("@")[0]}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        <Link 
                                            href="/profile" 
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profil Saya
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                handleLogout();
                                            }} 
                                            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Tampilan JIKA USER BELUM LOGIN
                            <Link href="/login" className="bg-[#005B5C] hover:bg-[#004748] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
