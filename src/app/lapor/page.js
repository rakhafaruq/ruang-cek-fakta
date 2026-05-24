"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LaporHoaksPage() {
    const router = useRouter();

    // State untuk Hak Akses
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // State untuk Form Input
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    // State untuk Status UI
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);

    // Proteksi Halaman (Hanya yang sudah login yang bisa melapor)
    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                // Jika belum login, arahkan ke halaman login
                router.push("/login");
            } else {
                setUser(session.user);
                setCheckingAuth(false);
            }
        };
        checkUser();
    }, [router]);

    // Handler saat file gambar dipilih
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validasi sederhana: Maksimal 5MB dan format gambar
        if (selectedFile.size > 5 * 1024 * 1024) {
            setErrorMsg("Ukuran gambar maksimal adalah 5MB.");
            setFile(null);
            return;
        }
        if (!selectedFile.type.startsWith("image/")) {
            setErrorMsg("Format file harus berupa gambar (JPG/PNG).");
            setFile(null);
            return;
        }

        setErrorMsg("");
        setFile(selectedFile);
    };

    // Handler saat form disubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            let evidence_img_url = null;

            // TAHAP 1: Unggah Gambar ke Supabase Storage (Jika ada)
            if (file) {
                // Buat nama file unik agar tidak bentrok
                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`; // Dikelompokkan berdasarkan ID user di Storage

                const { error: uploadError } = await supabase.storage.from("report-attachments").upload(filePath, file);

                if (uploadError) throw new Error("Gagal mengunggah gambar bukti. Silakan coba lagi.");

                // Dapatkan URL publik dari gambar yang baru diunggah
                const { data: publicUrlData } = supabase.storage.from("report-attachments").getPublicUrl(filePath);

                evidence_img_url = publicUrlData.publicUrl;
            }

            // TAHAP 2: Simpan Data ke Tabel Database
            const { error: insertError } = await supabase.from("hoax_reports").insert({
                user_id: user.id,
                title: title,
                platform: platform,
                description: description,
                url: url || null, // Kosongkan jika tidak diisi
                evidence_img: evidence_img_url,
            });

            if (insertError) throw new Error("Gagal menyimpan laporan. Pastikan koneksi stabil.");

            // Skenario Sukses
            setSuccessMsg(true);

            // Kosongkan form (Opsional, karena kita bisa langsung arahkan user ke Profil)
            setTitle("");
            setPlatform("");
            setUrl("");
            setDescription("");
            setFile(null);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Tampilan Loading saat memverifikasi sesi Supabase
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memverifikasi akses...</div>
            </div>
        );
    }

    // Tampilan Jika Berhasil Melapor
    if (successMsg) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Laporan Diterima!</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">Terima kasih atas kontribusi Anda. Tim kami akan segera menganalisis laporan ini. Anda dapat memantau status investigasinya di halaman profil Anda.</p>
                    <Link href="/profil" className="w-full inline-block bg-[#005B5C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004748] transition-colors">
                        Lihat Riwayat Laporan
                    </Link>
                    <button onClick={() => setSuccessMsg(false)} className="cursor-pointer mt-4 text-sm text-teal-700 font-medium hover:underline">
                        Kirim Laporan Lainnya
                    </button>
                </div>
            </div>
        );
    }

    // Tampilan Formulir Utama
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Form */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Formulir Lapor Hoaks</h1>
                    <p className="text-slate-600 max-w-xl mx-auto">Lengkapi data di bawah ini sejelas mungkin. Bukti yang akurat akan sangat membantu tim Fact-Checker kami dalam melakukan pelacakan digital.</p>
                </div>

                {/* Kotak Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Judul Laporan */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-900 mb-1">
                                    Judul Singkat Laporan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Contoh: Pesan Berantai Kuota Gratis 100GB"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors text-sm"
                                />
                            </div>

                            {/* Platform */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-1">
                                    Platform Penyebaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors text-sm"
                                >
                                    <option value="" disabled>
                                        Pilih Platform...
                                    </option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="X/Twitter">X / Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Lainnya">Lainnya / Tidak Tahu</option>
                                </select>
                            </div>

                            {/* URL Sumber */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-1">Tautan Sumber (Opsional)</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors text-sm"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Klaim */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">
                                Isi Klaim / Cerita Detail <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tuliskan isi pesan hoaks tersebut secara lengkap, atau jelaskan konteks dari gambar/video yang Anda curigai..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors text-sm resize-none"
                            ></textarea>
                        </div>

                        {/* Upload Bukti Gambar */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">Unggah Bukti Gambar (Opsional)</label>
                            <p className="text-xs text-slate-500 mb-3">Tangkapan layar (screenshot) pesan atau postingan. Format JPG/PNG (Maks. 5MB).</p>

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-teal-700">{file.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Klik untuk mengganti file</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                            <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <p className="text-sm">
                                                <span className="font-semibold text-teal-700">Klik untuk mengunggah</span> atau seret dan lepas
                                            </p>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                        {/* Area Peringatan Error */}
                        {errorMsg && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md font-medium">{errorMsg}</div>}

                        {/* Tombol Aksi */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`cursor-pointer px-8 py-3 rounded-lg text-sm font-bold text-white bg-[#005B5C] hover:bg-[#004748] transition-all shadow-sm flex items-center gap-2 ${loading ? "opacity-70 cursor-wait" : "hover:-translate-y-0.5"}`}
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? "Menyimpan Data..." : "Kirim Laporan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
