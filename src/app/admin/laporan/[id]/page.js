"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const STATUS_OPTIONS = [
    { value: "pending", label: "Menunggu Review" },
    { value: "investigating", label: "Sedang Diinvestigasi" },
    { value: "hoaks", label: "Terverifikasi: HOAKS" },
    { value: "fakta", label: "Terverifikasi: FAKTA" },
    { value: "menyesatkan", label: "Terverifikasi: MENYESATKAN" },
    { value: "ditolak", label: "Laporan Ditolak" },
];

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    investigating: "bg-blue-100 text-blue-800 border-blue-300",
    hoaks: "bg-red-100 text-red-800 border-red-300",
    fakta: "bg-emerald-100 text-emerald-800 border-emerald-300",
    menyesatkan: "bg-amber-100 text-amber-800 border-amber-300",
    ditolak: "bg-slate-100 text-slate-600 border-slate-300",
};

export default function DetailLaporanPage() {
    const { id } = useParams();
    const router = useRouter();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            const { data, error } = await supabase
                .from("hoax_reports")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setReport(data);
                setSelectedStatus(data.status || "pending");
            }
            setLoading(false);
        };

        if (id) fetchReport();
    }, [id]);

    const handleUpdateStatus = async () => {
        setSaving(true);
        setSaveMsg("");

        const { error } = await supabase
            .from("hoax_reports")
            .update({ status: selectedStatus })
            .eq("id", id);

        if (error) {
            setSaveMsg("❌ Gagal menyimpan status.");
        } else {
            setSaveMsg("✅ Status berhasil diperbarui.");
            setReport((prev) => ({ ...prev, status: selectedStatus }));
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat detail laporan...</div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-4xl font-bold text-slate-200 mb-4">404</p>
                    <p className="text-slate-600">Laporan tidak ditemukan.</p>
                    <Link href="/admin" className="mt-4 inline-block text-teal-700 font-semibold underline text-sm">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const statusColor = STATUS_COLORS[report.status] || STATUS_COLORS.pending;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/admin" className="hover:text-teal-700 transition-colors">Dashboard Admin</Link>
                    <span>›</span>
                    <span className="text-slate-900 font-medium">Detail Laporan #{id}</span>
                </nav>

                {/* Header Laporan */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-3 ${statusColor}`}>
                                {STATUS_OPTIONS.find(s => s.value === report.status)?.label || report.status}
                            </span>
                            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{report.title}</h1>
                            <p className="text-slate-500 text-sm mt-2 font-mono">
                                Dilaporkan pada {new Date(report.created_at).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        {/* Tombol Buat Artikel */}
                        <Link
                            href={`/admin/artikel/tambah?from_report=${id}`}
                            className="flex-shrink-0 bg-[#005B5C] hover:bg-[#004748] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Buat Artikel Klarifikasi
                        </Link>
                    </div>
                </div>

                {/* Isi Laporan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Konten Utama */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Deskripsi */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Deskripsi Laporan</h2>
                            <p className="text-slate-700 leading-relaxed">{report.description || "—"}</p>
                        </div>

                        {/* URL Sumber */}
                        {report.url && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">URL Sumber Klaim</h2>
                                <a
                                    href={report.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-700 hover:underline text-sm break-all"
                                >
                                    {report.url}
                                </a>
                            </div>
                        )}

                        {/* Bukti Gambar */}
                        {report.image_url && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Bukti Visual</h2>
                                <img
                                    src={report.image_url}
                                    alt="Bukti laporan"
                                    className="rounded-lg max-h-80 object-contain border border-slate-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Manajemen Status */}
                    <div className="space-y-4">
                        {/* Info Singkat */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Rincian Laporan</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between items-center gap-2">
                                    <span className="text-slate-500">Platform</span>
                                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                        {report.platform || "—"}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center gap-2">
                                    <span className="text-slate-500">ID Laporan</span>
                                    <span className="font-mono text-xs text-slate-400">#{id}</span>
                                </li>
                                {report.user_id && (
                                    <li className="flex justify-between items-start gap-2">
                                        <span className="text-slate-500">User ID</span>
                                        <span className="font-mono text-xs text-slate-400 text-right break-all">{report.user_id.substring(0, 16)}…</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Update Status */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Perbarui Status</h2>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none mb-3"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {saveMsg && (
                                <p className="text-xs mb-3 text-slate-600">{saveMsg}</p>
                            )}

                            <button
                                onClick={handleUpdateStatus}
                                disabled={saving || selectedStatus === report.status}
                                className="w-full bg-[#005B5C] hover:bg-[#004748] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                            >
                                {saving ? "Menyimpan..." : "Simpan Status"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
