"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const NAV_ITEMS = [
    {
        href: "/admin",
        label: "Dashboard",
        exact: true,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: "/admin/laporan",
        label: "Laporan Masuk",
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        badge: true,
    },
    {
        href: "/admin/artikel",
        label: "Kelola Artikel",
        exact: false,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        href: "/admin/artikel/tambah",
        label: "Tambah Artikel",
        exact: true,
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
        ),
        highlight: true,
    },
];

export default function AdminNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                // Ambil jumlah laporan pending
                const { count } = await supabase
                    .from("hoax_reports")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "pending");
                setPendingCount(count || 0);
            }
        };
        loadData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const isActive = (item) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    const userInitial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase()
        || user?.email?.charAt(0)?.toUpperCase()
        || "A";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

                {/* Logo & Brand */}
                <Link href="/admin" className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="w-8 h-8 bg-[#005B5C] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 leading-none">RCF Admin</div>
                        <div className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">Panel Pengelola</div>
                    </div>
                </Link>

                {/* Nav Items — Desktop */}
                <div className="hidden md:flex items-center gap-1 flex-1">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        if (item.highlight) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="ml-2 inline-flex items-center gap-1.5 bg-[#005B5C] hover:bg-[#004748] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                                    active
                                        ? "text-[#005B5C] bg-teal-50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                                {/* Badge laporan pending */}
                                {item.badge && pendingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {pendingCount > 9 ? "9+" : pendingCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side: Kembali ke Site + User Menu */}
                <div className="flex items-center gap-3">
                    {/* Link ke site publik */}
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat Site
                    </Link>

                    <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            id="admin-user-menu-btn"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-[#005B5C] flex items-center justify-center text-white text-sm font-bold">
                                {userInitial}
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-xs font-semibold text-slate-900 leading-none">
                                    {user?.user_metadata?.full_name || "Admin"}
                                </div>
                                <div className="text-[10px] text-teal-600 font-medium leading-none mt-0.5">Administrator</div>
                            </div>
                            <svg className="w-3.5 h-3.5 text-slate-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown User */}
                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-slate-100">
                                        <div className="text-xs font-semibold text-slate-900 truncate">{user?.email}</div>
                                        <div className="text-[10px] text-teal-600 mt-0.5">Administrator</div>
                                    </div>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Ke Beranda
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Hamburger Mobile */}
                    <button
                        id="admin-mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium border-b border-slate-50 ${
                                    active ? "text-[#005B5C] bg-teal-50" : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                                {item.badge && pendingCount > 0 && (
                                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            )}
        </nav>
    );
}
