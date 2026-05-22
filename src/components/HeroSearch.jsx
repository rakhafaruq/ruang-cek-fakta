"use client";

import { useState } from "react";

export default function HeroSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("https://api-llm-dot-ruang-cek-fakta.et.r.appspot.com/api/v1/fact_check_with_source", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: searchQuery }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error searching:", error);
            setResult({
                status: "error",
                analysis: {
                    summary: "Terjadi kesalahan saat memproses permintaan.",
                    label: "Uncertain",
                    explanation: error.message,
                    sources: [],
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            {/* Teks Heading & Subtitle */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-sans mb-6">
                Melawan Hoaks, <br className="hidden sm:block" />
                <span className="text-cyan-600">Bangun Literasi.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                Validasi informasi instan dan kembangkan kemampuan digital Anda untuk mendukung perdamaian dan keadilan <span className="font-semibold text-slate-700">(SDG 16)</span>.
            </p>

            {/* Kotak Pencarian (Search Bar) */}
            <div className="max-w-3xl mx-auto relative">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        {/* Ikon Kaca Pembesar (Search) */}
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        className="block w-full w-full bg-white border border-slate-300 rounded-full py-4 pl-14 pr-32 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all sm:text-lg"
                        placeholder="Masukkan judul berita atau URL yang mencurigakan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="cursor-pointer absolute right-2.5 inset-y-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-6 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                    >
                        Cari Fakta
                    </button>
                </form>
            </div>

            {/* Hot Topics (Tags) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Topik Hangat:</span>
                <div className="flex flex-wrap justify-center gap-2">
                    <button className="cursor-pointer text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full font-medium transition-colors">#PemiluDamai2026</button>
                    <button className="cursor-pointer text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full font-medium transition-colors">#AIDeepfake</button>
                    <button className="cursor-pointer text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full font-medium transition-colors">#KesehatanMasyarakat</button>
                </div>
            </div>
        </section>
    );
}
