"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LiterasiPusat() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            // PERUBAHAN QUERY: Kita memanggil relasi 'literacy_chapters' untuk mendapatkan daftar bab
            const { data, error } = await supabase
                .from("literacy_modules")
                .select(
                    `
                    *,
                    literacy_chapters (
                        slug,
                        order_index
                    )
                `,
                )
                .order("created_at", { ascending: true });

            if (!error && data) {
                setModules(data);
            }
            setLoading(false);
        };
        fetchModules();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat modul literasi...</div>
            </div>
        );
    }

    // PERBAIKAN TOMBOL HERO: Mencari slug dinamis untuk tombol utama di bagian atas
    const firstModule = modules.length > 0 ? modules[0] : null;
    const heroModuleSlug = firstModule ? firstModule.slug : "dasar-verifikasi";
    const heroChapterSlug = firstModule?.literacy_chapters?.find((ch) => ch.order_index === 1)?.slug || "bab-1";

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* SECTION 1: HERO UTAMA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Pusat <span className="text-teal-700">Literasi Digital</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-xl">Membekali Anda dengan keahlian untuk mengidentifikasi misinformasi, memverifikasi sumber, dan menavigasi lanskap digital dengan aman dan presisi.</p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            {/* Tombol Hero Dinamis */}
                            <Link href={`/literasi/${heroModuleSlug}/${heroChapterSlug}`} className="inline-flex items-center gap-2 bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-3 rounded-md font-medium transition-colors">
                                Mulai Belajar
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <a href="#modul" className="inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-md font-medium transition-colors">
                                Jelajahi Modul
                            </a>
                        </div>
                    </div>

                    {/* Visual Aset */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <svg className="w-24 h-24 text-teal-500/30 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-400">Visual Workspace Interface</div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: GRID MODUL PEMBELAJARAN */}
            <section id="modul" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Modul Pembelajaran</h2>
                    <p className="text-slate-500">Kuasai teknik verifikasi dasar hingga lanjutan untuk melindungi diri Anda dari manipulasi informasi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modules.map((mod) => {
                        // LOGIKA DINAMIS: Cari bab yang urutannya pertama (order_index === 1)
                        const firstChapter = mod.literacy_chapters?.find((ch) => ch.order_index === 1);
                        const firstChapterSlug = firstChapter ? firstChapter.slug : "bab-1";

                        return (
                            <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                                <div>
                                    <div
                                        className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 inline-block mb-6 group-hover:scale-110 transition-transform"
                                        dangerouslySetInnerHTML={{
                                            __html: mod.icon_svg
                                                ? mod.icon_svg
                                                      .replace(/className=/g, "class=")
                                                      .replace(/strokeWidth=/g, "stroke-width=")
                                                      .replace(/strokeLinecap=/g, "stroke-linecap=")
                                                      .replace(/strokeLinejoin=/g, "stroke-linejoin=")
                                                : "",
                                        }}
                                    />
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">{mod.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{mod.description}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    {/* Link sekarang menggunakan variabel firstChapterSlug yang dinamis */}
                                    <Link href={`/literasi/${mod.slug}/${firstChapterSlug}`} className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-900 group/link">
                                        Mulai Modul
                                        <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
