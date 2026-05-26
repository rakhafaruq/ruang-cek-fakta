"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DetailMateriLiterasi() {
    const { modulId, babId } = useParams();
    const router = useRouter();

    // State penyimpan data database
    const [moduleData, setModuleData] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    // State untuk menangani kuis "Cek Pengetahuan"
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const fetchMateriData = async () => {
            setLoading(true);
            
            // 1. Dapatkan info Modul Utama berdasarkan slug (modulId)
            const { data: modData, error: modError } = await supabase
                .from("literacy_modules")
                .select("*")
                .eq("slug", modulId)
                .single();

            if (modError || !modData) {
                setLoading(false);
                return;
            }
            setModuleData(modData);

            // 2. Dapatkan semua daftar bab yang terikat dengan module_id tersebut
            const { data: chapsData, error: chapsError } = await supabase
                .from("literacy_chapters")
                .select("*")
                .eq("module_id", modData.id)
                .order("order_index", { ascending: true });

            if (!chapsError && chapsData) {
                setChapters(chapsData);
                
                // 3. Cari bab spesifik yang sedang dibuka berdasarkan slug (babId)
                const activeChap = chapsData.find((ch) => ch.slug === babId);
                setCurrentChapter(activeChap || null);
            }
            setLoading(false);
        };

        fetchMateriData();
    }, [modulId, babId]);

    // Reset state kuis jika pengguna berpindah bab (useLayoutEffect agar tidak trigger cascading re-render)
    useLayoutEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedOption(null);
         
        setShowExplanation(false);
         
        setIsCorrect(false);
    }, [babId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat materi literasi...</div>
            </div>
        );
    }

    if (!moduleData || !currentChapter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800">Materi Tidak Ditemukan</h2>
                    <p className="text-slate-500 mt-2">Modul atau bab yang Anda cari belum tersedia.</p>
                    <Link href="/literasi" className="mt-4 inline-block text-teal-700 font-semibold underline">
                        Kembali ke Pusat Literasi
                    </Link>
                </div>
            </div>
        );
    }

    // Cari indeks bab saat ini untuk tombol navigasi bawah & kalkulasi progress bar
    const currentIdx = chapters.findIndex((ch) => ch.slug === babId);
    const prevChapter = chapters[currentIdx - 1];
    const nextChapter = chapters[currentIdx + 1];
    
    // Hitung persentase posisi pembaca dalam modul ini secara matematis
    const progressPercentage = chapters.length > 0 ? Math.round(((currentIdx + 1) / chapters.length) * 100) : 0;

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;
        setIsCorrect(selectedOption === currentChapter.quiz_correct_index);
        setShowExplanation(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* BREADCRUMB */}
                <nav className="flex text-xs md:text-sm text-slate-500 mb-8 font-mono overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-teal-700">Beranda</Link>
                    <span className="mx-2">›</span>
                    <Link href="/literasi" className="hover:text-teal-700">Literasi</Link>
                    <span className="mx-2">›</span>
                    <span className="text-slate-400">{moduleData.title}</span>
                    <span className="mx-2">›</span>
                    <span className="text-slate-900 font-medium">Bab {currentChapter.order_index}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* SIDEBAR KURIKULUM */}
                    <aside className="bg-white border border-slate-200 rounded-xl p-6 lg:sticky lg:top-24 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Kurikulum Modul</h3>
                        <div className="space-y-3">
                            {chapters.map((chapter) => {
                                const isActive = chapter.slug === babId;
                                return (
                                    <div
                                        key={chapter.id}
                                        className={`flex items-start gap-3 p-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                                            isActive ? "bg-teal-50 text-teal-900 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                        onClick={() => router.push(`/literasi/${modulId}/${chapter.slug}`)}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {isActive ? (
                                                <div className="w-4 h-4 rounded-full border-4 border-teal-700 flex items-center justify-center bg-white"></div>
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-slate-300 bg-white"></div>
                                            )}
                                        </div>
                                        <span className="leading-snug">{chapter.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress Bar Dinamis */}
                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5 font-mono">
                                <span>Progres Modul</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-700 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                    </aside>

                    {/* KONTEN ARTIKEL UTAMA */}
                    <main className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm">
                        <div className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-4">
                            <span>{moduleData.title}</span>
                            <span>•</span>
                            <span>Estimasi: {currentChapter.estimated_time}</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-100">
                            {currentChapter.title}
                        </h1>

                        <div className="space-y-6 text-slate-700 leading-relaxed text-base md:text-lg">
                            {/* Paragraf Utama */}
                            {currentChapter.content_paragraphs?.map((p, idx) => (
                                <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                            ))}

                            {/* Sub-judul Prinsip */}
                            {currentChapter.content_principles?.length > 0 && (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 pt-4">Prinsip Dasar Analisis</h2>
                                    <ul className="space-y-4 pl-0">
                                        {currentChapter.content_principles.map((prinsip, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-teal-700 font-black mt-0.5">•</span>
                                                <div>
                                                    <strong className="text-slate-900">{prinsip.title}</strong> {prinsip.desc}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {/* Tips Box */}
                            {currentChapter.content_tips && (
                                <div className="bg-teal-50/50 border-l-4 border-l-[#005B5C] rounded-r-xl p-5 mt-8 flex gap-3 items-start">
                                    <div className="bg-teal-100 text-teal-800 p-1.5 rounded-lg flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#005B5C] uppercase tracking-wider mb-1 font-mono">Tips Lab-Grade</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{currentChapter.content_tips}</p>
                                    </div>
                                </div>
                            )}

                            {/* KUIS INTERAKTIF */}
                            {currentChapter.quiz_question && (
                                <div className="border border-slate-200 rounded-xl p-6 bg-white mt-12">
                                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4 font-sans">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Cek Pengetahuan
                                    </h3>

                                    <p className="text-sm md:text-base font-semibold text-slate-900 mb-6 leading-snug">{currentChapter.quiz_question}</p>

                                    <div className="space-y-3 mb-6">
                                        {currentChapter.quiz_options?.map((option, idx) => (
                                            <label
                                                key={idx}
                                                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedOption === idx ? "border-teal-600 bg-teal-50/30" : "border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                <input type="radio" name="quiz-opt" className="mt-1 accent-teal-700" checked={selectedOption === idx} onChange={() => !showExplanation && setSelectedOption(idx)} disabled={showExplanation} />
                                                <span className="text-sm text-slate-700 leading-snug">{option}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {!showExplanation ? (
                                        <button
                                            onClick={handleCheckAnswer}
                                            disabled={selectedOption === null}
                                            className={`w-full md:w-auto md:float-right bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-2 rounded font-medium text-sm transition-colors ${selectedOption === null ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            Periksa Jawaban
                                        </button>
                                    ) : (
                                        <div className={`p-4 rounded-lg border text-sm leading-relaxed clear-both ${isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                                            <span className="font-bold block mb-1">{isCorrect ? "✓ Jawaban Benar!" : "✗ Jawaban Kurang Tepat"}</span>
                                            {currentChapter.quiz_explanation}
                                        </div>
                                    )}
                                    <div className="clear-both"></div>
                                </div>
                            )}
                        </div>

                        {/* NAVIGATION FOOTER */}
                        <div className="mt-16 pt-6 border-t border-slate-200 flex items-center justify-between">
                            {prevChapter ? (
                                <Link
                                    href={`/literasi/${modulId}/${prevChapter.slug}`}
                                    className="inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    ← Kembali ke Bab {prevChapter.order_index}
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextChapter ? (
                                <Link href={`/literasi/${modulId}/${nextChapter.slug}`} className="inline-flex items-center gap-1.5 bg-[#005B5C] hover:bg-[#004748] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                    Materi Selanjutnya →
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}