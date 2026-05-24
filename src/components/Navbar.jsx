"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Tutup mobile menu saat navigasi
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // Handler tombol "Lapor Hoaks": cek login dulu sebelum navigasi
    const handleLaporClick = (e) => {
        e.preventDefault();
        if (!user) {
            router.push("/login?callbackUrl=/lapor");
        } else {
            router.push("/lapor");
        }
    };

    const navLinks = [
        { href: "/cek-fakta", label: "Cek Fakta" },
        { href: "/literasi", label: "Literasi" },
        { href: "/tentang-kami", label: "Tentang Kami" },
    ];

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

                    {/* Bagian Tengah: Menu Navigasi (Desktop) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        pathname === link.href || pathname.startsWith(link.href + "/")
                                            ? "text-teal-700 font-semibold"
                                            : "text-slate-900 hover:text-teal-700"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Bagian Kanan: Auth + Lapor Hoaks */}
                    <div className="flex items-center gap-4">
                        {/* Tombol Lapor Hoaks — cek login dulu */}
                        <button
                            onClick={handleLaporClick}
                            className="hidden md:block cursor-pointer border border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
                        >
                            Lapor Hoaks
                        </button>

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
                            <Link href="/login" className="hidden md:block bg-[#005B5C] hover:bg-[#004748] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
                                Masuk
                            </Link>
                        )}

                        {/* Hamburger Button (Mobile) */}
                        <button
                            id="mobile-menu-button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-teal-700 hover:bg-slate-100 focus:outline-none transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    pathname === link.href || pathname.startsWith(link.href + "/")
                                        ? "bg-teal-50 text-teal-700 font-semibold"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Lapor Hoaks (Mobile) */}
                        <button
                            onClick={handleLaporClick}
                            className="w-full cursor-pointer text-left px-3 py-2.5 rounded-md text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors border border-teal-200 mt-2"
                        >
                            Lapor Hoaks
                        </button>

                        {/* Auth Button (Mobile) */}
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            {user ? (
                                <div className="flex items-center justify-between px-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#005B5C]">
                                            <img
                                                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || user.email.split("@")[0]}&background=005B5C&color=fff`}
                                                alt="User Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{user.user_metadata?.full_name || user.email.split("@")[0]}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-700"
                                    >
                                        Keluar
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-3 py-2.5 bg-[#005B5C] text-white rounded-md text-sm font-medium hover:bg-[#004748] transition-colors"
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
