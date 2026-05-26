/**
 * Global Loading UI untuk seluruh aplikasi Next.js (App Router).
 * Komponen ini ditampilkan secara otomatis oleh Suspense saat halaman
 * atau data sedang dimuat selama navigasi.
 */
export default function GlobalLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner animasi */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
                    <div className="w-12 h-12 rounded-full border-4 border-t-[#005B5C] animate-spin absolute inset-0"></div>
                </div>

                {/* Text */}
                <p className="text-sm font-medium text-slate-500 font-mono animate-pulse">
                    Memuat...
                </p>
            </div>
        </div>
    );
}
