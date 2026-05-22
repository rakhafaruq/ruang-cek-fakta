import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-surface/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Bagian Kiri: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-brand-text tracking-wide font-sans">
                            Ruang<span className="text-brand-cyan">CekFakta</span>
                        </Link>
                    </div>

                    {/* Bagian Tengah: Menu Navigasi (Desktop) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/cek-fakta" className="text-brand-text hover:text-brand-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Cek Fakta
                            </Link>
                            <Link href="/quiz" className="text-brand-text hover:text-brand-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Kuis Literasi
                            </Link>
                            <Link href="/about" className="text-brand-text hover:text-brand-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Tentang Kami
                            </Link>
                        </div>
                    </div>

                    {/* Bagian Kanan: Tombol Action & Profil */}
                    <div className="flex items-center gap-4">
                        <Link href="/lapor" className="hidden md:block border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                            Lapor Hoaks
                        </Link>
                        {/* Avatar Placeholder */}
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer">
                            <span className="text-brand-text-muted text-xs">User</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
