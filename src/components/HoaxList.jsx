"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Config badge status
const STATUS_CONFIG = {
    HOAKS: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "HOAKS",
    },
    FAKTA: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        label: "FAKTA",
    },
    MENYESATKAN: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "MENYESATKAN",
    },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.HOAKS;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
            {cfg.label}
        </span>
    );
}

export default function HoaxList() {
    const [latestFacts, setLatestFacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            const { data, error } = await supabase
                .from("hoax_db")
                .select("id, slug, status, category, title, description, published_at")
                .order("published_at", { ascending: false })
                .limit(6);

            if (!error && data) {
                setLatestFacts(
                    data.map((item) => ({
                        ...item,
                        url: `/cek-fakta/${item.slug}`,
                        date: new Date(item.published_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }),
                    }))
                );
            }
            setLoading(false);
        };

        fetchLatest();
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-brand-text font-sans mb-2">Pantauan Hoaks Terkini</h2>
                    <p className="text-brand-text-muted max-w-xl">
                        Kumpulan klarifikasi isu viral terbaru yang telah diverifikasi oleh tim Ruang Cek Fakta.
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">Live Update</span>
                </div>
            </div>

            {/* Skeleton Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                                <div className="h-4 bg-slate-100 rounded w-24"></div>
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-4/5 mb-4"></div>
                            <div className="h-3 bg-slate-100 rounded w-full mb-1"></div>
                            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestFacts.map((fact) => (
                        <Link
                            key={fact.id}
                            href={fact.url}
                            className="group bg-brand-surface rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full"
                        >
                            {/* Badge + Tanggal */}
                            <div className="mb-4 flex items-center justify-between">
                                <StatusBadge status={fact.status} />
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {fact.date}
                                </div>
                            </div>

                            {/* Kategori */}
                            {fact.category && (
                                <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full self-start mb-3">
                                    {fact.category}
                                </span>
                            )}

                            {/* Judul */}
                            <h3 className="text-base font-bold text-brand-text mb-3 flex-grow line-clamp-3 group-hover:text-brand-cyan transition-colors leading-snug">
                                {fact.title}
                            </h3>

                            {/* Deskripsi */}
                            {fact.description && (
                                <p className="text-sm text-brand-text-muted line-clamp-2 mb-4 leading-relaxed">
                                    {fact.description}
                                </p>
                            )}

                            {/* Tombol Aksi */}
                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-brand-cyan group-hover:text-cyan-700 flex items-center gap-1 transition-colors">
                                    Baca Cek Fakta
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Tombol Lihat Semua */}
            <div className="text-center mt-12">
                <Link
                    href="/cek-fakta"
                    className="inline-flex items-center gap-2 bg-brand-text hover:bg-slate-800 text-white px-8 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                    Lihat Semua Laporan
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
