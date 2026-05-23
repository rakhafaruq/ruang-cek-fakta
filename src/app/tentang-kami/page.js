import Link from "next/link";
import { ShieldCheck, Target, Eye, CheckCircle2 } from "lucide-react";

export default function TentangKami() {
    return (
        <div className="min-h-screen bg-white font-sans pb-24">
            {/* 1. HERO SECTION */}
            <section className="bg-slate-50 py-20 lg:py-32 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                            Menjaga Integritas <br className="hidden md:block" /> Digital Indonesia
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
                            Ruang Cek Fakta adalah instrumen verifikasi independen yang didedikasikan untuk memerangi disinformasi melalui metodologi lab-grade, literasi kritis, dan teknologi analisis data tingkat lanjut.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="#metodologi" className="inline-flex justify-center items-center px-8 py-3 rounded-md bg-[#005B5C] text-white font-medium hover:bg-[#004748] transition-colors">
                                Lihat Metodologi
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. VISI MISI SECTION */}
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Misi Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-[#005B5C] rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Misi Kami</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Membangun ekosistem informasi yang sehat dengan menyediakan verifikasi fakta yang akurat, cepat, dan berbasis bukti untuk setiap narasi publik yang berpotensi menyesatkan.
                            </p>
                        </div>

                        {/* Visi Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                                <Eye className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi Kami</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Menjadi pusat keunggulan (Center of Excellence) dalam verifikasi informasi digital di Asia Tenggara, diakui secara global karena ketajaman analisis dan integritas absolut.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. METODOLOGI SECTION */}
            <section id="metodologi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Metodologi Kami</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Kami tidak menebak-nebak kebenaran. Setiap klaim yang kami publikasikan telah melewati proses verifikasi yang ketat dan berbasis bukti material.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Kurasi Laporan</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">Kami memantau tren media sosial dan menerima laporan langsung dari masyarakat mengenai isu atau pesan berantai yang mencurigakan.</p>
                        </div>

                        <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Investigasi Forensik</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">Tim menggunakan alat OSINT (Open Source Intelligence), Reverse Image Search, dan melacak sumber asli dari institusi resmi yang kredibel.</p>
                        </div>

                        <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Publikasi Transparan</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">Menyajikan kesimpulan (Hoaks, Fakta, atau Menyesatkan) lengkap dengan bukti rincian dan metodologi yang bisa dilacak balik oleh pembaca.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-[#005B5C] rounded-2xl p-10 md:p-16 text-white shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Mari Berkontribusi</h2>
                    <p className="text-teal-100 mb-8 max-w-xl mx-auto text-lg">Menemukan informasi mencurigakan di grup obrolan atau linimasa Anda? Jangan biarkan hoaks menyebar luas.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/lapor" className="bg-white text-teal-800 hover:bg-slate-50 font-bold px-8 py-3 rounded-full transition-colors">
                            Lapor Hoaks Sekarang
                        </Link>
                        <Link href="/literasi" className="border border-teal-200 text-teal-50 hover:bg-teal-800 font-bold px-8 py-3 rounded-full transition-colors">
                            Mulai Belajar Literasi
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
