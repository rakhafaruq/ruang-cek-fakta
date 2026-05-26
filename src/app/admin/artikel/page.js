"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CATEGORIES = [
    "Semua Kategori",
    "Kesehatan", "Politik", "Ekonomi", "Sosial", "Teknologi",
    "Hukum", "Pendidikan", "Lingkungan", "Olahraga", "Umum",
];

const STATUS_CONFIG = {
    HOAKS:        { label: "HOAKS",        bg: "bg-red-100 text-red-700 border-red-200",             dot: "bg-red-500"     },
    FAKTA:        { label: "FAKTA",        bg: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    MENYESATKAN:  { label: "MENYESATKAN", bg: "bg-amber-100 text-amber-700 border-amber-200",       dot: "bg-amber-400"   },
};

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status?.toUpperCase()] || {
        label: status,
        bg: "bg-slate-100 text-slate-500 border-slate-200",
        dot: "bg-slate-400",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border tracking-wide ${cfg.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function StatCard({ label, value, color, icon }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
                <svg className={`w-5 h-5 ${color.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
            </div>
            <div>
                <div className={`text-2xl font-extrabold ${color.text}`}>{value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
            </div>
        </div>
    );
}

// SortIcon harus dideklarasikan di luar komponen induk agar tidak dibuat ulang setiap render
function SortIcon({ col, sortBy, sortAsc }) {
    return (
        <svg className={`w-3 h-3 ml-1 inline transition-colors ${sortBy === col ? "text-[#005B5C]" : "text-slate-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d={sortBy === col && sortAsc ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
            {[...Array(5)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                </td>
            ))}
        </tr>
    );
}

export default function KelolaArtikelPage() {
    const router = useRouter();
    const [articles, setArticles]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [stats, setStats]                 = useState({ total: 0, hoaks: 0, fakta: 0, menyesatkan: 0 });
    const [error, setError]                 = useState(null);

    // Filter state
    const [search, setSearch]               = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("Semua Kategori");
    const [filterStatus, setFilterStatus]   = useState("Semua");
    const [sortBy, setSortBy]               = useState("published_at");
    const [sortAsc, setSortAsc]             = useState(false);

    // Pagination
    const [page, setPage]                   = useState(1);
    const [totalCount, setTotalCount]       = useState(0);

    // Selection
    const [selected, setSelected]           = useState(new Set());
    const [deleting, setDeleting]           = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // single article
    const [bulkConfirm, setBulkConfirm]     = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch stats once on mount
    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabase.from("hoax_db").select("status");
            if (data) {
                const s = { total: data.length, hoaks: 0, fakta: 0, menyesatkan: 0 };
                data.forEach(r => {
                    const key = r.status?.toLowerCase();
                    if (key && key in s) s[key]++;
                });
                setStats(s);
            }
        };
        fetchStats();
    }, [articles]); // re-run after mutations

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSelected(new Set());

        const from = (page - 1) * PAGE_SIZE;
        const to   = from + PAGE_SIZE - 1;

        let query = supabase
            .from("hoax_db")
            .select("id, slug, title, description, status, category, author, published_at", { count: "exact" })
            .order(sortBy, { ascending: sortAsc })
            .range(from, to);

        if (filterStatus !== "Semua") query = query.eq("status", filterStatus);
        if (filterCategory !== "Semua Kategori") query = query.eq("category", filterCategory);
        if (debouncedSearch) query = query.ilike("title", `%${debouncedSearch}%`);

        const { data, error: fetchError, count } = await query;
        if (fetchError) {
            setError(fetchError.message);
        } else {
            setArticles(data || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    }, [page, sortBy, sortAsc, filterStatus, filterCategory, debouncedSearch]);

    // fetchArticles dibungkus useCallback sehingga referensinya stabil.
    // Ini aman karena setState terjadi setelah await (async), bukan sinkron.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchArticles(); }, [fetchArticles]);

    // ── Handlers ──
    const toggleSort = (col) => {
        if (sortBy === col) setSortAsc(v => !v);
        else { setSortBy(col); setSortAsc(false); }
        setPage(1);
    };

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === articles.length) setSelected(new Set());
        else setSelected(new Set(articles.map(a => a.id)));
    };

    const handleDeleteOne = async (id) => {
        setDeleting(true);
        await supabase.from("hoax_db").delete().eq("id", id);
        setDeleteConfirm(null);
        setDeleting(false);
        fetchArticles();
    };

    const handleBulkDelete = async () => {
        setDeleting(true);
        await supabase.from("hoax_db").delete().in("id", [...selected]);
        setBulkConfirm(false);
        setDeleting(false);
        fetchArticles();
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
        });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Kelola Artikel</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Daftar semua artikel klarifikasi yang telah dipublikasikan.</p>
                </div>
                <Link
                    href="/admin/artikel/tambah"
                    className="inline-flex items-center gap-2 bg-[#005B5C] hover:bg-[#004748] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tulis Artikel Baru
                </Link>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Artikel"
                    value={stats.total}
                    color={{ bg: "bg-slate-100", icon: "text-slate-600", text: "text-slate-900" }}
                    icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
                <StatCard
                    label="Artikel HOAKS"
                    value={stats.hoaks}
                    color={{ bg: "bg-red-50", icon: "text-red-500", text: "text-red-600" }}
                    icon="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
                <StatCard
                    label="Artikel FAKTA"
                    value={stats.fakta}
                    color={{ bg: "bg-emerald-50", icon: "text-emerald-500", text: "text-emerald-600" }}
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <StatCard
                    label="Menyesatkan"
                    value={stats.menyesatkan}
                    color={{ bg: "bg-amber-50", icon: "text-amber-500", text: "text-amber-600" }}
                    icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    <p className="font-semibold">Gagal memuat artikel</p>
                    <p className="font-mono text-xs mt-1">{error}</p>
                </div>
            )}

            {/* ── Main Table Card ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">

                    {/* Bulk action bar (muncul saat ada yang dipilih) */}
                    {selected.size > 0 ? (
                        <div className="flex items-center gap-3 flex-1 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
                            <span className="text-sm font-semibold text-teal-800">
                                {selected.size} artikel dipilih
                            </span>
                            <button
                                onClick={() => setBulkConfirm(true)}
                                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus Terpilih
                            </button>
                            <button
                                onClick={() => setSelected(new Set())}
                                className="text-xs text-teal-600 hover:text-teal-900 font-medium"
                            >
                                Batal
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Search */}
                            <div className="relative flex-1 max-w-xs">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari judul artikel..."
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white w-full transition-all"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Category filter */}
                            <select
                                value={filterCategory}
                                onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>

                            {/* Status filter */}
                            <select
                                value={filterStatus}
                                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option>Semua</option>
                                <option>HOAKS</option>
                                <option>FAKTA</option>
                                <option>MENYESATKAN</option>
                            </select>
                        </>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="pl-6 pr-3 py-3.5 w-10">
                                    <input
                                        type="checkbox"
                                        checked={articles.length > 0 && selected.size === articles.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none" onClick={() => toggleSort("title")}>
                                    Judul Artikel <SortIcon col="title" sortBy={sortBy} sortAsc={sortAsc} />
                                </th>
                                <th className="px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none" onClick={() => toggleSort("category")}>
                                    Kategori <SortIcon col="category" sortBy={sortBy} sortAsc={sortAsc} />
                                </th>
                                <th className="px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none" onClick={() => toggleSort("status")}>
                                    Status <SortIcon col="status" sortBy={sortBy} sortAsc={sortAsc} />
                                </th>
                                <th className="px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none" onClick={() => toggleSort("author")}>
                                    Penulis <SortIcon col="author" sortBy={sortBy} sortAsc={sortAsc} />
                                </th>
                                <th className="px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none" onClick={() => toggleSort("published_at")}>
                                    Tanggal <SortIcon col="published_at" sortBy={sortBy} sortAsc={sortAsc} />
                                </th>
                                <th className="px-4 py-3.5 pr-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
                            ) : articles.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                            <p className="font-medium">
                                                {debouncedSearch
                                                    ? `Tidak ditemukan artikel dengan judul "${debouncedSearch}"`
                                                    : "Belum ada artikel yang dipublikasikan"}
                                            </p>
                                            <Link href="/admin/artikel/tambah" className="text-teal-700 text-sm font-semibold hover:underline">
                                                + Tulis artikel pertama
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                articles.map(article => (
                                    <tr
                                        key={article.id}
                                        className={`hover:bg-slate-50/70 transition-colors group ${selected.has(article.id) ? "bg-teal-50/40" : ""}`}
                                    >
                                        {/* Checkbox */}
                                        <td className="pl-6 pr-3 py-4 w-10">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(article.id)}
                                                onChange={() => toggleSelect(article.id)}
                                                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                            />
                                        </td>

                                        {/* Judul */}
                                        <td className="px-4 py-4 max-w-xs">
                                            <Link href={`/cek-fakta/${article.slug}`} target="_blank" className="group/link">
                                                <div className="font-semibold text-slate-900 truncate group-hover/link:text-[#005B5C] transition-colors">
                                                    {article.title || "—"}
                                                </div>
                                                {article.description && (
                                                    <div className="text-xs text-slate-400 truncate mt-0.5">{article.description}</div>
                                                )}
                                            </Link>
                                        </td>

                                        {/* Kategori */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                                                {article.category || "—"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <StatusBadge status={article.status} />
                                        </td>

                                        {/* Penulis */}
                                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                                            {article.author || "—"}
                                        </td>

                                        {/* Tanggal */}
                                        <td className="px-4 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                                            {formatDate(article.published_at)}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-4 pr-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/artikel/edit/${article.slug}`}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-2.5 py-1.5 rounded-lg transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm(article)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 px-2.5 py-1.5 rounded-lg transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {!loading && totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 font-mono">
                            Menampilkan{" "}
                            <span className="font-semibold text-slate-600">
                                {Math.min((page - 1) * PAGE_SIZE + 1, totalCount)}–{Math.min(page * PAGE_SIZE, totalCount)}
                            </span>{" "}
                            dari <span className="font-semibold text-slate-600">{totalCount}</span> artikel
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
                                let pageNum;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (page <= 3) pageNum = i + 1;
                                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = page - 2 + i;
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
            </div>

            {/* ── Modal: Konfirmasi Hapus Satu ── */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 text-center mb-2">Hapus Artikel?</h3>
                        <p className="text-sm text-slate-500 text-center mb-1">Artikel ini akan dihapus permanen:</p>
                        <p className="text-sm font-semibold text-slate-800 text-center bg-slate-50 rounded-lg px-3 py-2 mb-5 line-clamp-2">
                            {deleteConfirm.title}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDeleteOne(deleteConfirm.id)}
                                disabled={deleting}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                            >
                                {deleting ? "Menghapus..." : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Konfirmasi Hapus Bulk ── */}
            {bulkConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setBulkConfirm(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 text-center mb-2">Hapus {selected.size} Artikel?</h3>
                        <p className="text-sm text-slate-500 text-center mb-5">
                            Tindakan ini tidak dapat dibatalkan. Semua artikel yang dipilih akan dihapus secara permanen.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setBulkConfirm(false)}
                                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                            >
                                {deleting ? "Menghapus..." : `Hapus ${selected.size} Artikel`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
