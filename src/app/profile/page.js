"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCards from "@/components/profile/StatsCards";
import ReportItem from "@/components/profile/ReportItems";

export default function ProfilPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, selesai: 0 });

    useEffect(() => {
        const initProfile = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) return router.push("/login");

            setUser(session.user);

            const { data: laporan } = await supabase.from("hoax_reports").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });

            if (laporan) {
                setReports(laporan);
                setStats({
                    total: laporan.length,
                    pending: laporan.filter((r) => ["pending", "investigating"].includes(r.status)).length,
                    selesai: laporan.filter((r) => ["hoaks", "fakta", "menyesatkan"].includes(r.status)).length,
                });
            }
            setLoading(false);
        };

        initProfile();
    }, [router]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-pulse font-mono text-sm text-slate-500">Syncing with server...</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-12 lg:pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <ProfileHeader user={user} />

                <StatsCards stats={stats} />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-900">Riwayat Laporan Saya</h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {reports.length === 0 ? <div className="p-12 text-center text-slate-400 italic">Belum ada kontribusi laporan.</div> : reports.map((report) => <ReportItem key={report.id} report={report} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}
