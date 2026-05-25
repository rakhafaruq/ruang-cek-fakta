"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdminAccess = async () => {
            // 1. Periksa sesi login aktif
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/login");
                return;
            }

            // 2. Tarik role dari tabel user_roles
            const { data: roleData, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .single();

            // 3. Validasi: hanya admin yang bisa masuk
            if (error || !roleData || roleData.role !== "admin") {
                router.replace("/");
            } else {
                setIsAuthorized(true);
            }
        };

        checkAdminAccess();
    }, [router]);

    // Loading screen saat memverifikasi
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-mono text-xs tracking-widest">Memverifikasi akses admin...</p>
                </div>
            </div>
        );
    }

    return (
        // Layout admin: navbar khusus di atas, konten di bawah
        // "group" dipakai untuk konteks layout admin agar bisa dibedakan dari layout publik via CSS jika perlu
        <div className="min-h-screen bg-slate-50" data-layout="admin">
            {/* Navbar admin menggantikan Navbar publik */}
            <AdminNavbar />

            {/* Konten halaman admin — diberi padding atas 64px sesuai tinggi navbar */}
            <div className="pt-16">
                <main className="min-h-[calc(100vh-64px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
