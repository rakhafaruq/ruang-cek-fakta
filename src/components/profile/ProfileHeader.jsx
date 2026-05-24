import Link from "next/link";

export default function ProfileHeader({ user }) {
    const initial = user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-[#005B5C] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">{initial}</div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{user?.user_metadata?.full_name || "Pengguna Literasi"}</h1>
                <p className="text-slate-500 font-mono text-sm">{user?.email}</p>
            </div>
            <div className="md:ml-auto">
                <Link href="/lapor" className="bg-[#005B5C] hover:bg-[#004748] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2 active:scale-95">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Laporan Baru
                </Link>
            </div>
        </div>
    );
}
