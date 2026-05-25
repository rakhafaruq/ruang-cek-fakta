"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HOT_TOPICS = [
    { tag: "#PemiluDamai2026",       query: "pemilu damai 2026",         color: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100" },
    { tag: "#AIDeepfake",            query: "AI deepfake video palsu",    color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { tag: "#KesehatanMasyarakat",   query: "hoaks kesehatan masyarakat", color: "text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100" },
    { tag: "#VaksinMitos",           query: "mitos vaksin berbahaya",     color: "text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100" },
];

const PLACEHOLDERS = [
    "Masukkan judul berita yang mencurigakan...",
    "Contoh: \"Vaksin mengandung microchip\"",
    "Contoh: \"Gempa diprediksi besok pagi\"",
    "Cari fakta dari artikel atau URL...",
    "Contoh: \"Bantuan sosial Rp5 juta untuk semua\"",
];

const QUICK_ACTIONS = [
    {
        id: "browse-hoaks",
        href: "/cek-fakta?status=HOAKS",
        label: "Hoaks Terbongkar",
        desc: "Klaim yang sudah diverifikasi palsu",
        icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
        color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
        iconColor: "text-red-500",
    },
    {
        id: "browse-fakta",
        href: "/cek-fakta?status=FAKTA",
        label: "Fakta Valid",
        desc: "Informasi yang telah terkonfirmasi benar",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
        iconColor: "text-emerald-500",
    },
    {
        id: "lapor-hoaks",
        href: "/lapor",
        label: "Lapor Hoaks",
        desc: "Temukan hoaks? Laporkan ke tim kami",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
        iconColor: "text-amber-500",
    },
];

export default function HeroSearch() {
    const [query, setQuery]               = useState("");
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
    const [isTyping, setIsTyping]         = useState(true);
    const router = useRouter();

    // Typing animation untuk placeholder
    useEffect(() => {
        const target = PLACEHOLDERS[placeholderIdx];
        let charIdx   = 0;
        let timeoutId;

        if (isTyping) {
            // Type forward
            const typeNext = () => {
                if (charIdx <= target.length) {
                    setDisplayedPlaceholder(target.slice(0, charIdx));
                    charIdx++;
                    timeoutId = setTimeout(typeNext, 45);
                } else {
                    // Pause lalu mulai erase
                    timeoutId = setTimeout(() => setIsTyping(false), 2000);
                }
            };
            typeNext();
        } else {
            // Erase backward
            let cur = target.length;
            const eraseNext = () => {
                if (cur >= 0) {
                    setDisplayedPlaceholder(target.slice(0, cur));
                    cur--;
                    timeoutId = setTimeout(eraseNext, 25);
                } else {
                    // Next placeholder
                    setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
                    setIsTyping(true);
                }
            };
            eraseNext();
        }

        return () => clearTimeout(timeoutId);
    }, [placeholderIdx, isTyping]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/cek-fakta?q=${encodeURIComponent(q)}`);
    };

    const handleHotTopic = (topic) => {
        router.push(`/cek-fakta?q=${encodeURIComponent(topic.query)}`);
    };

    return (
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">

            {/* Subtle background blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-20 -right-32 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                Platform Literasi Digital &amp; Anti-Hoaks
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
                Melawan Hoaks,{" "}
                <br className="hidden sm:block" />
                <span className="text-cyan-600">Bangun Literasi.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Validasi informasi instan dan kembangkan kemampuan digital Anda untuk
                mendukung perdamaian dan keadilan{" "}
                <span className="font-semibold text-slate-700">(SDG 16)</span>.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-full">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        id="hero-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={displayedPlaceholder || "Cari berita atau klaim..."}
                        className="block w-full bg-white border border-slate-300 rounded-full py-4 pl-13 pr-40 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all sm:text-lg"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-36 text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                        </button>
                    )}

                    <button
                        id="hero-search-button"
                        type="submit"
                        className="cursor-pointer absolute right-2.5 inset-y-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white rounded-full px-7 text-sm font-semibold transition-all hover:shadow-md focus:outline-none flex items-center gap-2"
                    >
                        Cari Fakta
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </form>

                {/* Hot Topics */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <span className="text-xs text-slate-400 font-medium flex-shrink-0">Topik Hangat:</span>
                    <div className="flex flex-wrap justify-center gap-2">
                        {HOT_TOPICS.map((topic) => (
                            <button
                                key={topic.tag}
                                onClick={() => handleHotTopic(topic)}
                                className={`cursor-pointer text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95`}
                            >
                                {topic.tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUICK_ACTIONS.map((action) => (
                    <Link
                        key={action.id}
                        id={action.id}
                        href={action.href}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${action.color}`}
                    >
                        <div className={`w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 ${action.iconColor}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-bold leading-tight">{action.label}</div>
                            <div className="text-xs opacity-70 mt-0.5 leading-snug">{action.desc}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
