"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Badge warna berdasarkan label hasil analisis AI
const getLabelStyle = (label) => {
    const map = {
        "Hoaks": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", display: "HOAKS" },
        "Fakta": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", display: "FAKTA" },
        "Menyesatkan": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", display: "MENYESATKAN" },
        "Uncertain": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400", display: "TIDAK PASTI" },
    };
    return map[label] || map["Uncertain"];
};

const HOT_TOPICS = [
    { tag: "#PemiluDamai2026", query: "Pemilu Damai 2026" },
    { tag: "#AIDeepfake", query: "AI Deepfake video palsu" },
    { tag: "#KesehatanMasyarakat", query: "hoaks kesehatan masyarakat" },
];

export default function HeroSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Fungsi utama pencarian
    const performSearch = async (query) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("https://api-llm-dot-ruang-cek-fakta.et.r.appspot.com/api/v1/fact_check_with_source", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: query }),
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
                    explanation: "Tidak dapat terhubung ke server analisis. Silakan coba lagi.",
                    sources: [],
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await performSearch(searchQuery);
    };

    // Hot topic diklik → isi search bar + langsung cari
    const handleHotTopicClick = async (topic) => {
        setSearchQuery(topic.query);
        await performSearch(topic.query);
    };

    return (
        <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            {/* Teks Heading & Subtitle */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-sans mb-6">
                Melawan Hoaks, <br className="hidden sm:block" />
                <span className="text-cyan-600">Bangun Literasi.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                Validasi informasi instan dan kembangkan kemampuan digital Anda untuk mendukung perdamaian dan keadilan{" "}
                <span className="font-semibold text-slate-700">(SDG 16)</span>.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        id="hero-search-input"
                        className="block w-full bg-white border border-slate-300 rounded-full py-4 pl-14 pr-36 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all sm:text-lg"
                        placeholder="Masukkan judul berita atau URL yang mencurigakan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                        id="hero-search-button"
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer absolute right-2.5 inset-y-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white rounded-full px-6 text-sm font-medium transition-colors focus:outline-none flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menganalisis...
                            </>
                        ) : (
                            "Cari Fakta"
                        )}
                    </button>
                </form>
            </div>

            {/* Hot Topics */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Topik Hangat:</span>
                <div className="flex flex-wrap justify-center gap-2">
                    {HOT_TOPICS.map((topic) => (
                        <button
                            key={topic.tag}
                            onClick={() => handleHotTopicClick(topic)}
                            className="cursor-pointer text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                        >
                            {topic.tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hasil Analisis AI */}
            {(isLoading || result) && (
                <div className="mt-10 max-w-3xl mx-auto">
                    {/* Skeleton Loading */}
                    {isLoading && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
                                <div className="w-32 h-4 bg-slate-100 rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                            </div>
                        </div>
                    )}

                    {/* Result Card */}
                    {!isLoading && result && result.analysis && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden text-left animate-in fade-in duration-300">
                            {/* Header Result */}
                            {(() => {
                                const style = getLabelStyle(result.analysis.label);
                                return (
                                    <div className={`px-6 py-4 border-b ${style.bg} ${style.border} flex items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                                <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                                                {style.display}
                                            </span>
                                            <span className="text-sm text-slate-500 font-medium">Hasil Analisis AI</span>
                                        </div>
                                        <button
                                            onClick={() => setResult(null)}
                                            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
                                            aria-label="Tutup hasil"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })()}

                            {/* Body Result */}
                            <div className="p-6 space-y-4">
                                {/* Summary */}
                                {result.analysis.summary && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Ringkasan</h3>
                                        <p className="text-slate-800 leading-relaxed">{result.analysis.summary}</p>
                                    </div>
                                )}

                                {/* Penjelasan */}
                                {result.analysis.explanation && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Penjelasan</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{result.analysis.explanation}</p>
                                    </div>
                                )}

                                {/* Sumber */}
                                {result.analysis.sources && result.analysis.sources.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Sumber Referensi</h3>
                                        <ul className="space-y-1.5">
                                            {result.analysis.sources.slice(0, 3).map((source, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={typeof source === "string" ? source : source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-cyan-600 hover:text-cyan-800 hover:underline flex items-center gap-1.5"
                                                    >
                                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        {typeof source === "string" ? source : (source.title || source.url)}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Footer — CTA ke halaman Cek Fakta */}
                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Dianalisis oleh AI Ruang Cek Fakta</span>
                                <button
                                    onClick={() => router.push(`/cek-fakta`)}
                                    className="cursor-pointer text-xs font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                                >
                                    Lihat Semua Cek Fakta
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
