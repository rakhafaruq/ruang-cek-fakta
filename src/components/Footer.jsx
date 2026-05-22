export default function Footer() {
    return (
        <footer className="bg-brand-surface border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Bagian Kiri: Hak Cipta */}
                    <div className="text-sm text-brand-text-muted">&copy; {new Date().getFullYear()} Ruang Cek Fakta. All rights reserved.</div>

                    {/* Bagian Kanan: SDG 16 Dedication */}
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-text">
                        <span className="inline-block w-2 height-2 rounded-full bg-brand-cyan animate-pulse"></span>
                        Mendukung <span className="text-brand-cyan font-bold">SDG 16</span>: Perdamaian, Keadilan & Kelembagaan yang Kuat
                    </div>
                </div>
            </div>
        </footer>
    );
}
