"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const CATEGORIES = ["Kesehatan", "Politik", "Ekonomi", "Sosial", "Teknologi", "Hukum", "Pendidikan", "Lingkungan", "Olahraga", "Umum"];

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 80) + "-" + new Date().getFullYear();
}

function TambahArtikelForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromReportId = searchParams.get("from_report");

    const [sourceReport, setSourceReport] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("HOAKS");
    const [category, setCategory] = useState("Umum");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("Tim Investigasi RCF");
    const [analisis, setAnalisis] = useState(""); // paragraf dipisah newline
    const [visualLabel, setVisualLabel] = useState("");
    const [visualDesc, setVisualDesc] = useState("");
    const [kesimpulanTitle, setKesimpulanTitle] = useState("");
    const [kesimpulanDesc, setKesimpulanDesc] = useState("");
    const [standar, setStandar] = useState("IFCN Compliance");

    // Image upload
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        if (selected.size > 5 * 1024 * 1024) {
            setError("Ukuran gambar maksimal 5MB.");
            return;
        }
        if (!selected.type.startsWith("image/")) {
            setError("Format file harus berupa gambar (JPG/PNG/WEBP).");
            return;
        }
        setError("");
        setImageFile(selected);
        setImagePreview(URL.createObjectURL(selected));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    // Auto-generate slug saat title berubah
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (title) setSlug(generateSlug(title));
    }, [title]);

    // Pre-fill dari laporan jika ada from_report
    useEffect(() => {
        if (!fromReportId) return;
        const fetchReport = async () => {
            const { data } = await supabase
                .from("hoax_reports")
                .select("*")
                .eq("id", fromReportId)
                .single();

            if (data) {
                setSourceReport(data);
                setTitle(data.title || "");
                setDescription(data.description || "");
                setAnalisis(data.description || "");
            }
        };
        fetchReport();
    }, [fromReportId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        // Konversi paragraf analisis dari newline ke array
        const analisisParagraphs = analisis
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean);

        if (!title || !slug || !description || !kesimpulanTitle || !kesimpulanDesc) {
            setError("Lengkapi semua field yang wajib diisi (*).");
            setSaving(false);
            return;
        }

        // Upload gambar ke Supabase Storage jika ada
        let visual_image_url = null;
        if (imageFile) {
            setUploadingImage(true);
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `artikel/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("report-attachments")
                .upload(filePath, imageFile);

            if (uploadError) {
                setError(`Gagal mengunggah gambar: ${uploadError.message}`);
                setSaving(false);
                setUploadingImage(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from("report-attachments")
                .getPublicUrl(filePath);

            visual_image_url = publicUrlData.publicUrl;
            setUploadingImage(false);
        }

        const { error: insertError } = await supabase.from("hoax_db").insert({
            slug,
            status,
            category,
            title,
            description,
            author,
            analisis_paragraphs: analisisParagraphs,
            visual_image_label: visualLabel || null,
            visual_description: visualDesc || null,
            visual_image_url: visual_image_url,
            kesimpulan_title: kesimpulanTitle,
            kesimpulan_description: kesimpulanDesc,
            rincian_standar: standar,
        });

        if (insertError) {
            setError(`Gagal menyimpan artikel: ${insertError.message}`);
            setSaving(false);
            return;
        }

        // Jika berasal dari laporan, update status laporan jadi 'investigating'
        if (fromReportId) {
            await supabase
                .from("hoax_reports")
                .update({ status: "investigating" })
                .eq("id", fromReportId);
        }

        setSuccess(true);
        setTimeout(() => router.push("/admin"), 2000);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Artikel Berhasil Dipublikasikan!</h2>
                    <p className="text-slate-500 text-sm">Mengalihkan ke dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/admin" className="hover:text-teal-700 transition-colors">Dashboard Admin</Link>
                    <span>›</span>
                    <span className="text-slate-900 font-medium">Tulis Artikel Klarifikasi</span>
                </nav>

                {/* Banner laporan sumber (jika ada) */}
                {sourceReport && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                        <div className="font-semibold text-blue-800 mb-1">📋 Pre-filled dari Laporan #{fromReportId}</div>
                        <div className="text-blue-700">{sourceReport.title}</div>
                        <Link href={`/admin/laporan/${fromReportId}`} className="text-xs text-blue-600 underline mt-1 inline-block">
                            Lihat detail laporan →
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bagian 1: Metadata */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Metadata Artikel</h2>

                        {/* Judul */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Judul Artikel <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Contoh: Klaim Vaksin Mengandung Microchip adalah Hoaks"
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Slug URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                placeholder="vaksin-microchip-hoaks-2024"
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white"
                            />
                            <p className="text-xs text-slate-400 mt-1">URL: /cek-fakta/<strong>{slug || "slug-artikel"}</strong></p>
                        </div>

                        {/* Status + Kategori + Author */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Status Verifikasi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="HOAKS">HOAKS</option>
                                    <option value="FAKTA">FAKTA</option>
                                    <option value="MENYESATKAN">MENYESATKAN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Penulis</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Deskripsi ringkas */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Ringkasan (untuk kartu listing) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={2}
                                placeholder="Deskripsi singkat 1-2 kalimat tentang klaim yang diverifikasi..."
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Bagian 2: Isi Artikel */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Isi Artikel</h2>

                        {/* Analisis */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Analisis Sumber Klaim
                                <span className="ml-2 text-slate-400 font-normal normal-case">(pisahkan paragraf dengan Enter)</span>
                            </label>
                            <textarea
                                value={analisis}
                                onChange={(e) => setAnalisis(e.target.value)}
                                rows={6}
                                placeholder="Paragraf pertama analisis...

Paragraf kedua analisis..."
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-y"
                            />
                        </div>

                        {/* Verifikasi Visual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Label Gambar Verifikasi</label>
                                <input
                                    type="text"
                                    value={visualLabel}
                                    onChange={(e) => setVisualLabel(e.target.value)}
                                    placeholder="Contoh: Tangkapan Layar Forensik"
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Verifikasi Visual</label>
                                <input
                                    type="text"
                                    value={visualDesc}
                                    onChange={(e) => setVisualDesc(e.target.value)}
                                    placeholder="Penjelasan singkat tentang bukti visual..."
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Upload Gambar Verifikasi */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Unggah Gambar Verifikasi
                                <span className="ml-2 text-slate-400 font-normal normal-case">(Opsional · JPG/PNG/WEBP · Maks. 5MB)</span>
                            </label>

                            {imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL lokal dari file upload, tidak bisa dioptimasi oleh next/image */}
                                    <img
                                        src={imagePreview}
                                        alt="Preview gambar verifikasi"
                                        className="w-full max-h-64 object-contain"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                                            Ganti
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {imageFile?.name} · {imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors group">
                                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-teal-600 transition-colors">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <p className="text-sm">
                                            <span className="font-semibold text-teal-600">Klik untuk mengunggah</span> atau seret & lepas
                                        </p>
                                        <p className="text-xs text-slate-400">JPG, PNG, WEBP hingga 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>

                        {/* Kesimpulan */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Judul Kesimpulan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={kesimpulanTitle}
                                onChange={(e) => setKesimpulanTitle(e.target.value)}
                                required
                                placeholder="Berdasarkan investigasi komprehensif, klaim ini adalah..."
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Isi Kesimpulan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={kesimpulanDesc}
                                onChange={(e) => setKesimpulanDesc(e.target.value)}
                                required
                                rows={3}
                                placeholder="Penjelasan detail tentang hasil verifikasi dan imbauan untuk masyarakat..."
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-y"
                            />
                        </div>

                        {/* Standar */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Standar Metodologi</label>
                            <input
                                type="text"
                                value={standar}
                                onChange={(e) => setStandar(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Error + Submit */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pb-8">
                        <Link
                            href="/admin"
                            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                        >
                            ← Batal, kembali ke dashboard
                        </Link>
                        <button
                            type="submit"
                            disabled={saving || uploadingImage}
                            className="bg-[#005B5C] hover:bg-[#004748] disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm inline-flex items-center gap-2"
                        >
                            {(saving || uploadingImage) && (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            )}
                            {uploadingImage ? "Mengunggah gambar..." : saving ? "Menyimpan..." : "Publikasikan Artikel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TambahArtikelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat form...</div>
            </div>
        }>
            <TambahArtikelForm />
        </Suspense>
    );
}
