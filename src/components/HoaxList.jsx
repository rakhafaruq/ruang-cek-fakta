import Link from "next/link";

// Data simulasi sementara untuk UI
const dummyHoaxes = [
    {
        id: 1,
        title: "Pesan Berantai WhatsApp: Radiasi Kosmik Berbahaya Malam Ini",
        status: "HOAKS",
        date: "22 Mei 2026",
    },
    {
        id: 2,
        title: "Pemerintah Bagikan Bantuan Kuota Internet 100GB via Link Telegram",
        status: "HOAKS",
        date: "21 Mei 2026",
    },
    {
        id: 3,
        title: "Klarifikasi Pendaftaran CPNS 2026 Melalui Portal Resmi BKN",
        status: "FAKTA",
        date: "20 Mei 2026",
    },
];

export default function HoaxList() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Header Bagian */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-text font-sans mb-4">Pantauan Hoaks Terkini</h2>
                <p className="text-brand-text-muted max-w-2xl mx-auto">Kumpulan klarifikasi isu viral terbaru yang telah diverifikasi oleh tim Ruang Cek Fakta.</p>
            </div>

            {/* Grid Kartu Berita */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dummyHoaxes.map((hoax) => (
                    <div key={hoax.id} className="bg-brand-surface rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full group">
                        <div className="mb-4 flex items-center">
                            {/* Badge Status Dinamis */}
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${hoax.status === "HOAKS" ? "bg-brand-orange text-white" : "bg-brand-cyan text-white"}`}>{hoax.status}</span>
                            <span className="text-xs text-brand-text-muted ml-3">{hoax.date}</span>
                        </div>

                        {/* Judul Berita */}
                        <h3 className="text-lg font-bold text-brand-text mb-4 flex-grow line-clamp-3 group-hover:text-brand-cyan transition-colors">{hoax.title}</h3>

                        {/* Tombol Aksi */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <Link href="#" className="text-sm font-semibold text-brand-cyan hover:text-cyan-700 flex items-center gap-1">
                                Baca Cek Fakta
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tombol Muat Lebih Banyak */}
            <div className="text-center mt-12">
                <Link href="/cek-fakta" className="cursor-pointer bg-brand-text hover:bg-slate-800 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors">Lihat Semua Laporan</Link>
            </div>
        </section>
    );
}
