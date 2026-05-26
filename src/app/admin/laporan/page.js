"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const STATUS_CONFIG = {
    pending:      { label: "Menunggu",     bg: "bg-yellow-100 text-yellow-800 border-yellow-200",  dot: "bg-yellow-400" },
    investigating:{ label: "Diproses",     bg: "bg-blue-100 text-blue-800 border-blue-200",        dot: "bg-blue-400"   },
    hoaks:        { label: "Hoaks",        bg: "bg-red-100 text-red-800 border-red-200",           dot: "bg-red-500"    },
    fakta:        { label: "Fakta Valid",  bg: "bg-emerald-100 text-emerald-800 border-emerald-200",dot: "bg-emerald-500"},
    menyesatkan:  { label: "Menyesatkan", bg: "bg-amber-100 text-amber-800 border-amber-200",      dot: "bg-amber-400"  },
    ditolak:      { label: "Ditolak",     bg: "bg-slate-100 text-slate-600 border-slate-200",      dot: "bg-slate-400"  },
};

const PLATFORM_ICONS = {
    WhatsApp:  "💬",
    Facebook:  "📘",
    Twitter:   "🐦",
    Instagram: "📸",
    TikTok:    "🎵",
    YouTube:   "▶️",
    Telegram:  "✈️",
};

const TABS = [
    { key: "all",          label: "Semua",         filter: null },
    { key: "pending",      label: "Menunggu",       filter: "pending" },
    { key: "investigating",label: "Diproses",       filter: "investigating" },
    { key: "selesai",      label: "Selesai",        filter: ["hoaks", "fakta", "menyesatkan"] },
    { key: "ditolak",      label: "Ditolak",        filter: "ditolak" },
];

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status?.toLowerCase()] || {
        label: status,
        bg: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function PlatformBadge({ platform }) {
    const icon = PLATFORM_ICONS[platform] || "🌐";
    return (
        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            <span>{icon}</span>
            {platform || "—"}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                </td>
            ))}
        </tr>
    );
}

export default function LaporanMasukPage() {
    const [reports, setReports]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [activeTab, setActiveTab]     = useState("all");
    const [search, setSearch]           = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage]               = useState(1);
    const [totalCount, setTotalCount]   = useState(0);
    const [tabCounts, setTabCounts]     = useState({});
    const [error, setError]             = useState(null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch tab counts once
    useEffect(() => {
        const fetchCounts = async () => {
            const { data } = await supabase
                .from("hoax_reports")
                .select("status");
            if (data) {
                const counts = {};
                data.forEach(r => {
                    const s = r.status?.toLowerCase() || "pending";
                    counts[s] = (counts[s] || 0) + 1;
                });
                counts.all     = data.length;
                counts.selesai = (counts.hoaks || 0) + (counts.fakta || 0) + (counts.menyesatkan || 0);
                setTabCounts(counts);
            }
        };
        fetchCounts();
    }, []);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);

        const tab = TABS.find(t => t.key === activeTab);
        const from = (page - 1) * PAGE_SIZE;
        const to   = from + PAGE_SIZE - 1;

        let query = supabase
            .from("hoax_reports")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        // Status filter
        if (tab?.filter) {
            if (Array.isArray(tab.filter)) {
                query = query.in("status", tab.filter);
            } else {
                query = query.eq("status", tab.filter);
            }
        }

        // Search filter
        if (debouncedSearch) {
            query = query.ilike("title", `%${debouncedSearch}%`);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setReports(data || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    }, [activeTab, page, debouncedSearch]);

    // fetchReports dibungkus useCallback sehingga referensinya stabil (tidak berubah tiap render).
    // Ini aman karena setState terjadi setelah await (async), bukan sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchReports(); }, [fetchReports]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
        });

    const formatTime = (d) =>
        new Date(d).toLocaleTimeString("id-ID", {
            hour: "2-digit", minute: "2-digit",
        });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Laporan Masuk</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Kelola dan investigasi laporan hoaks yang dikirimkan masyarakat.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchReports}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg transition-colors bg-white"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold">Gagal memuat laporan</p>
                        <p className="font-mono text-xs mt-1">{error}</p>
                        <p className="text-xs mt-1 text-red-600">Kemungkinan penyebab: RLS Policy belum dikonfigurasi untuk admin.</p>
                    </div>
                </div>
            )}

            {/* ── Main Card ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Filter Tabs + Search */}
                <div className="px-6 pt-5 pb-0 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

                        {/* Tabs */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveTab(tab.key); setPage(1); }}
                                    className={`relative inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors ${
                                        activeTab === tab.key
                                            ? "text-[#005B5C] bg-teal-50"
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                    }`}
                                >
                                    {tab.label}
                                    {tabCounts[tab.key] > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                            activeTab === tab.key
                                                ? "bg-teal-100 text-teal-700"
                                                : "bg-slate-100 text-slate-500"
                                        }`}>
                                            {tabCounts[tab.key]}
                                        </span>
                                    )}
                                    {activeTab === tab.key && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005B5C] rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-shrink-0">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari judul laporan..."
                                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white w-56 transition-all"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5">Tanggal</th>
                                <th className="px-6 py-3.5">Judul Laporan</th>
                                <th className="px-6 py-3.5">Platform</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="font-medium">
                                                {debouncedSearch
                                                    ? `Tidak ada laporan yang cocok dengan "${debouncedSearch}"`
                                                    : "Belum ada laporan dalam kategori ini"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reports.map(report => (
                                    <tr key={report.id} className="hover:bg-slate-50/70 transition-colors group">
                                        {/* Tanggal */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-mono text-slate-700 font-medium">{formatDate(report.created_at)}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">{formatTime(report.created_at)}</div>
                                        </td>

                                        {/* Judul */}
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="font-semibold text-slate-900 truncate group-hover:text-[#005B5C] transition-colors">
                                                {report.title || "—"}
                                            </div>
                                            {report.description && (
                                                <div className="text-xs text-slate-400 truncate mt-0.5">
                                                    {report.description}
                                                </div>
                                            )}
                                        </td>

                                        {/* Platform */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <PlatformBadge platform={report.platform} />
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={report.status} />
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/admin/laporan/${report.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-white bg-teal-50 hover:bg-[#005B5C] border border-teal-200 hover:border-[#005B5C] px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                Investigasi
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 font-mono">
                            Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, totalCount)}–{Math.min(page * PAGE_SIZE, totalCount)} dari <span className="font-semibold text-slate-600">{totalCount}</span> laporan
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                // Smart pagination window
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                                            pageNum === page
                                                ? "bg-[#005B5C] text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer info jika 1 halaman */}
                {!loading && totalPages <= 1 && reports.length > 0 && (
                    <div className="px-6 py-3.5 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-mono">
                            Total <span className="font-semibold text-slate-600">{totalCount}</span> laporan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
