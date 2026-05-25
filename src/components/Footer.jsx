import Link from "next/link";

const NAV_LINKS = [
    {
        heading: "Platform",
        links: [
            { label: "Cek Fakta", href: "/cek-fakta" },
            { label: "Pusat Literasi", href: "/literasi" },
            { label: "Tentang Kami", href: "/tentang-kami" },
            { label: "Lapor Hoaks", href: "/lapor" },
        ],
    },
    {
        heading: "Akun",
        links: [
            { label: "Masuk", href: "/login" },
            { label: "Daftar", href: "/register" },
            { label: "Profil Saya", href: "/profile" },
        ],
    },
];

const SOCIAL_LINKS = [
    {
        label: "Gmail",
        href: "mailto:ruangcekfakta@gmail.com",
        text: "ruangcekfakta@gmail.com",
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://instagram.com/ruangcekfakta",
        text: "@ruangcekfakta",
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
        ),
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto">

            {/* ── Main Footer ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Logo */}
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-400 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-lg font-extrabold text-white tracking-tight">
                                Ruang<span className="text-cyan-400">CekFakta</span>
                            </span>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Platform literasi digital dan verifikasi fakta independen untuk mewujudkan masyarakat yang cerdas dalam mengonsumsi informasi.
                        </p>

                        {/* SDG Badge */}
                        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3.5 py-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-300">
                                Mendukung <span className="text-cyan-400">SDG 16</span> &nbsp;·&nbsp; IFCN Compliant
                            </span>
                        </div>
                    </div>

                    {/* Nav Columns */}
                    {NAV_LINKS.map((col) => (
                        <div key={col.heading}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                                {col.heading}
                            </h3>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors inline-block hover:translate-x-0.5 duration-150"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Kontak & Sosial */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                            Hubungi Kami
                        </h3>
                        <div className="space-y-3">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.href.startsWith("mailto") ? "_self" : "_blank"}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 group-hover:bg-cyan-500 group-hover:border-cyan-500 flex items-center justify-center text-slate-400 group-hover:text-white transition-all flex-shrink-0">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
                                        <div className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors font-medium leading-tight">
                                            {s.text}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                        &copy; {year} <span className="text-slate-400 font-medium">Ruang Cek Fakta</span>. Seluruh hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-slate-600 font-mono">
                        Dibuat dengan ❤️ untuk Indonesia bebas hoaks
                    </p>
                </div>
            </div>
        </footer>
    );
}
