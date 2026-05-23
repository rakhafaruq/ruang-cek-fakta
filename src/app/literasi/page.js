import Link from "next/link";

// Data untuk 3 Modul Pembelajaran sesuai desain UI Anda
const modules = [
    {
        id: "dasar-verifikasi",
        title: "Dasar Verifikasi",
        description: "Pelajari prinsip-prinsip fundamental untuk membedakan fakta dari fiksi di media sosial.",
        icon: (
            <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        id: "keamanan-digital",
        title: "Keamanan Digital",
        description: "Praktik terbaik untuk melindungi data pribadi dan privasi Anda dari ancaman siber.",
        icon: (
            <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
    },
    {
        id: "berpikir-kritis",
        title: "Berpikir Kritis",
        description: "Kembangkan kerangka berpikir logis untuk menganalisis narasi dan argumen yang menyesatkan.",
        icon: (
            <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>
        ),
    },
];

export default function LiterasiPusat() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* SECTION 1: HERO UTAMA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Sisi Kiri: Teks dan CTA */}
                    <div className="space-y-6 text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Pusat <span className="text-teal-700">Literasi Digital</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-xl">Membekali Anda dengan keahlian untuk mengidentifikasi misinformasi, memverifikasi sumber, dan menavigasi lanskap digital dengan aman dan presisi.</p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            {/* Tombol Mulai Belajar langsung mengarah ke sub-bab pertama dari modul pertama */}
                            <Link href="/literasi/dasar-verifikasi/mengidentifikasi-sumber" className="inline-flex items-center gap-2 bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-3 rounded-md font-medium transition-colors">
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

                    {/* Sisi Kanan: Aset Visual Ilustrasi (Sesuai Gambar UI Anda) */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                        {/* Catatan: Di sini dipasang representasi grafis hologram teknologi/laptop. 
              Nanti Anda bisa menggantinya dengan tag <Image> dari Next.js jika file gambarnya sudah siap.
            */}
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
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Modul Pembelajaran</h2>
                    <p className="text-slate-500">Kuasai teknik verifikasi dasar hingga lanjutan untuk melindungi diri Anda dari manipulasi informasi.</p>
                </div>

                {/* Grid 3 Kolom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modules.map((mod) => (
                        <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                            <div>
                                {/* Pembungkus Icon Kotak Biru Muda Sesuai Desain UI */}
                                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 inline-block mb-6 group-hover:scale-110 transition-transform">{mod.icon}</div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">{mod.title}</h3>

                                <p className="text-slate-500 text-sm leading-relaxed mb-8">{mod.description}</p>
                            </div>

                            {/* Link Aksi di Bagian Bawah Kartu */}
                            <div className="pt-4 border-t border-slate-100">
                                {/* Sesuai strategi kita, tautan ini akan langsung me-lempar user ke bab 1 dari masing-masing modul.
                  Contoh untuk dasar-verifikasi akan menuju /literasi/dasar-verifikasi/mengidentifikasi-sumber
                */}
                                <Link href={`/literasi/${mod.id}/mengidentifikasi-sumber`} className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-900 group/link">
                                    Mulai Modul
                                    <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
