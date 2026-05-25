"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const STATUS_MAP = {
    pending: { label: "Menunggu", bg: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    investigating: { label: "Diproses", bg: "bg-blue-100 text-blue-800 border-blue-200" },
    hoaks: { label: "Hoaks", bg: "bg-red-100 text-red-800 border-red-200" },
    fakta: { label: "Fakta Valid", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    menyesatkan: { label: "Menyesatkan", bg: "bg-amber-100 text-amber-800 border-amber-200" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_MAP[status?.toLowerCase()] || { label: status, bg: "bg-slate-100 text-slate-800 border-slate-200" };
    return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.bg}`}>{cfg.label}</span>;
}

export default function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, selesai: 0 });

    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            const { data, error } = await supabase
                .from("hoax_reports")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("[Admin] Error fetching reports:", error);
                setFetchError(error.message);
            } else {
                setReports(data || []);
                setStats({
                    total: (data || []).length,
                    pending: (data || []).filter((r) => r.status === "pending").length,
                    investigating: (data || []).filter((r) => r.status === "investigating").length,
                    selesai: (data || []).filter((r) => ["hoaks", "fakta", "menyesatkan"].includes(r.status)).length,
                });
            }
            setLoading(false);
        };

        fetchReports();
    }, []);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat data antrean laporan...</div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Admin</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola laporan dan buat artikel klarifikasi hoaks.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/artikel/tambah"
                        className="bg-[#005B5C] hover:bg-[#004748] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tulis Artikel Baru
                    </Link>
                </div>
            </div>

            {/* Error Banner (muncul jika ada masalah fetch, biasanya RLS policy) */}
            {fetchError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    <div className="font-bold mb-1">⚠️ Gagal memuat laporan dari database</div>
                    <div className="font-mono text-xs text-red-600 bg-red-100 px-3 py-2 rounded-lg mt-2">{fetchError}</div>
                    <div className="mt-3 text-xs text-red-600">
                        <strong>Kemungkinan penyebab:</strong> RLS Policy untuk admin belum ditambahkan di Supabase.
                        Jalankan file <code className="bg-red-100 px-1 rounded">supabase_admin_schema.sql</code> di SQL Editor Supabase.
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Laporan", value: stats.total, color: "text-slate-900", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                    { label: "Menunggu Review", value: stats.pending, color: "text-yellow-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { label: "Sedang Diproses", value: stats.investigating, color: "text-blue-600", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                    { label: "Selesai Diverifikasi", value: stats.selesai, color: "text-emerald-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <svg className={`w-5 h-5 mb-3 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} />
                        </svg>
                        <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabel Laporan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Antrean Laporan Masuk</h2>
                    <span className="text-xs text-slate-400 font-mono">{reports.length} laporan</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Judul Laporan</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-slate-400 italic">
                                        Belum ada laporan masuk.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                                            {formatDate(report.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 truncate max-w-xs">{report.title}</div>
                                            {report.description && (
                                                <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{report.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                                                {report.platform || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/admin/laporan/${report.id}`}
                                                className="text-teal-700 hover:text-teal-900 font-semibold text-xs bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded transition-colors"
                                            >
                                                Investigasi →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
