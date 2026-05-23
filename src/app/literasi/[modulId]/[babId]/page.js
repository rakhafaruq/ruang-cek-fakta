"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
// Import data terpusat yang sudah kita isi artikelnya kemarin
import { literasiData } from "@/data/dummyData";

export default function DetailMateriLiterasi() {
    const { modulId, babId } = useParams();
    const router = useRouter();

    // State untuk menangani kuis "Cek Pengetahuan"
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Ambil data modul dan bab secara dinamis berdasarkan URL
    const currentModule = literasiData[modulId];
    const currentChapter = currentModule?.chapters.find((ch) => ch.id === babId);

    // Reset state kuis jika pengguna berpindah bab
    useEffect(() => {
        setSelectedOption(null);
        setShowExplanation(false);
        setIsCorrect(false);
    }, [babId]);

    // Jika URL yang dimasukkan salah atau tidak ada di data dummy
    if (!currentModule || !currentChapter) {
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

    // Cari index bab saat ini untuk navigasi tombol "Sebelumnya" & "Selanjutnya"
    const currentIdx = currentModule.chapters.findIndex((ch) => ch.id === babId);
    const prevChapter = currentModule.chapters[currentIdx - 1];
    const nextChapter = currentModule.chapters[currentIdx + 1];

    // Logika pengecekan jawaban kuis
    const handleCheckAnswer = () => {
        if (selectedOption === null) return;
        const correctIdx = currentChapter.quiz.correctAnswerIndex;
        setIsCorrect(selectedOption === correctIdx);
        setShowExplanation(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* BREADCRUMB (Navigasi Jejak) */}
                <nav className="flex text-xs md:text-sm text-slate-500 mb-8 font-mono overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-teal-700">
                        Beranda
                    </Link>
                    <span className="mx-2">›</span>
                    <Link href="/literasi" className="hover:text-teal-700">
                        Literasi
                    </Link>
                    <span className="mx-2">›</span>
                    <span className="text-slate-400">{currentModule.title}</span>
                    <span className="mx-2">›</span>
                    <span className="text-slate-900 font-medium">{currentChapter.title.split(" ")[1]}</span>
                </nav>

                {/* LAYOUT UTAMA: 2 KOLOM */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* SISI KIRI: SIDEBAR KURIKULUM MODUL */}
                    <aside className="bg-white border border-slate-200 rounded-xl p-6 lg:sticky lg:top-24 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Kurikulum Modul</h3>

                        {/* Daftar Bab List */}
                        <div className="space-y-3">
                            {currentModule.chapters.map((chapter) => {
                                const isActive = chapter.id === babId;
                                const isLocked = chapter.status === "terkunci";
                                const isDone = chapter.status === "selesai";

                                return (
                                    <div
                                        key={chapter.id}
                                        className={`flex items-start gap-3 p-2.5 rounded-lg text-sm transition-colors ${
                                            isActive ? "bg-teal-50 text-teal-900 font-semibold" : isLocked ? "text-slate-400 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50 cursor-pointer"
                                        }`}
                                        onClick={() => !isLocked && router.push(`/literasi/${modulId}/${chapter.id}`)}
                                    >
                                        {/* Render Icon Dinamis Berdasarkan Status Bab */}
                                        <div className="mt-0.5 flex-shrink-0">
                                            {isDone && (
                                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {isActive && <div className="w-4 h-4 rounded-full border-4 border-teal-700 flex items-center justify-center bg-white"></div>}
                                            {isLocked && (
                                                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="leading-snug">{chapter.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress Bar Keseluruhan Modul */}
                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5 font-mono">
                                <span>Progres Keseluruhan Modul</span>
                                <span>{currentModule.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-700 h-full transition-all duration-500" style={{ width: `${currentModule.progress}%` }}></div>
                            </div>
                        </div>
                    </aside>

                    {/* SISI KANAN: KONTEN MATERI UTAMA */}
                    <main className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm">
                        {/* Meta Atas */}
                        <div className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-4">
                            <span>{currentModule.title}</span>
                            <span>•</span>
                            <span>Estimasi: {currentChapter.estimatedTime}</span>
                        </div>

                        {/* Judul Bab Utama */}
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b border-slate-100">{currentChapter.title.split(" ").slice(1).join(" ")}</h1>

                        {/* RENDER ISI TEKS ARTIKEL SECARA DINAMIS */}
                        {currentChapter.content ? (
                            <div className="space-y-6 text-slate-700 leading-relaxed text-base md:text-lg">
                                {/* Paragraf Utama */}
                                {currentChapter.content.paragraphs.map((p, idx) => (
                                    <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                                ))}

                                {/* Sub-judul Tambahan */}
                                <h2 className="text-xl font-bold text-slate-900 pt-4">Prinsip Dasar Analisis</h2>

                                {/* Daftar Poin Prinsip */}
                                <ul className="space-y-4 pl-0">
                                    {currentChapter.content.principles.map((prinsip, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-teal-700 font-black mt-0.5">•</span>
                                            <div>
                                                <strong className="text-slate-900">{prinsip.title}</strong> {prinsip.desc}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tips Lab-Grade (Callout Box Hijau/Teal Sesuai Desain UI Anda) */}
                                <div className="bg-teal-50/50 border-l-4 border-l-[#005B5C] rounded-r-xl p-5 mt-8 flex gap-3 items-start">
                                    <div className="bg-teal-100 text-teal-800 p-1.5 rounded-lg flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#005B5C] uppercase tracking-wider mb-1 font-mono">Tips Lab-Grade</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{currentChapter.content.tips}</p>
                                    </div>
                                </div>

                                {/* BOX: CEK PENGETAHUAN (KUIS INTERAKTIF) */}
                                <div className="border border-slate-200 rounded-xl p-6 bg-white mt-12">
                                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4 font-sans">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        Cek Pengetahuan
                                    </h3>

                                    <p className="text-sm md:text-base font-semibold text-slate-900 mb-6 leading-snug">{currentChapter.quiz.question}</p>

                                    {/* Radio Options List */}
                                    <div className="space-y-3 mb-6">
                                        {currentChapter.quiz.options.map((option, idx) => (
                                            <label
                                                key={idx}
                                                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedOption === idx ? "border-teal-600 bg-teal-50/30" : "border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                <input type="radio" name="quiz-opt" className="mt-1 accent-teal-700" checked={selectedOption === idx} onChange={() => !showExplanation && setSelectedOption(idx)} disabled={showExplanation} />
                                                <span className="text-sm text-slate-700 leading-snug">{option}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Submit Button & Feedback Action */}
                                    {!showExplanation ? (
                                        <button
                                            onClick={handleCheckAnswer}
                                            disabled={selectedOption === null}
                                            className={`w-full md:w-auto md:float-right bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-2 rounded font-medium text-sm transition-colors ${
                                                selectedOption === null ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            Periksa Jawaban
                                        </button>
                                    ) : (
                                        <div className={`p-4 rounded-lg border text-sm leading-relaxed clear-both ${isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                                            <span className="font-bold block mb-1">{isCorrect ? "✓ Jawaban Benar!" : "✗ Jawaban Kurang Tepat"}</span>
                                            {currentChapter.quiz.explanation}
                                        </div>
                                    )}
                                    <div className="clear-both"></div>
                                </div>
                            </div>
                        ) : (
                            /* Tampilan Jika Mengakses Sub-Bab Yang Memang Belum Ditulis Kontennya (Efek Segera Hadir) */
                            <div className="text-center py-16 text-slate-400">
                                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    />
                                </svg>
                                Materi untuk sub-bab ini sedang disusun oleh tim pemeriksa fakta.
                            </div>
                        )}

                        {/* NAVIGATION FOOTER (Tombol Bawah Halaman) */}
                        <div className="mt-16 pt-6 border-t border-slate-200 flex items-center justify-between">
                            {prevChapter ? (
                                <Link
                                    href={`/literasi/${modulId}/${prevChapter.id}`}
                                    className="inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    ← Kembali ke {prevChapter.title.split(" ")[0]}
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextChapter && nextChapter.status !== "terkunci" ? (
                                <Link href={`/literasi/${modulId}/${nextChapter.id}`} className="inline-flex items-center gap-1.5 bg-[#005B5C] hover:bg-[#004748] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
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
