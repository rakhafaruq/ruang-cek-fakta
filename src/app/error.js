"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global Error Boundary untuk seluruh aplikasi Next.js (App Router).
 * Komponen ini ditampilkan secara otomatis ketika terjadi runtime error
 * yang tidak tertangani di dalam tree komponen mana pun.
 */
export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Log error ke console (bisa diganti dengan layanan monitoring seperti Sentry)
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Terjadi Kesalahan
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Maaf, ada sesuatu yang tidak berjalan dengan baik. Silakan coba muat
                    ulang halaman, atau kembali ke beranda.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Coba Lagi
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                    >
                        Ke Beranda
                    </Link>
                </div>

                {/* Error detail (hanya di development) */}
                {process.env.NODE_ENV === "development" && (
                    <details className="mt-8 text-left bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <summary className="text-xs font-mono text-slate-500 cursor-pointer mb-2">
                            Detail Error (dev only)
                        </summary>
                        <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap break-all">
                            {error?.message}
                            {"\n"}
                            {error?.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
