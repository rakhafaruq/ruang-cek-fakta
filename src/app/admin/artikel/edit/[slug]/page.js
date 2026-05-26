"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const CATEGORIES = ["Kesehatan", "Politik", "Ekonomi", "Sosial", "Teknologi", "Hukum", "Pendidikan", "Lingkungan", "Olahraga", "Umum"];

function EditArtikelForm() {
    const router = useRouter();
    const { slug } = useParams();

    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError]                 = useState("");
    const [success, setSuccess]             = useState(false);
    const [articleId, setArticleId]         = useState(null);

    // Form fields
    const [title, setTitle]                 = useState("");
    const [editSlug, setEditSlug]           = useState("");
    const [status, setStatus]               = useState("HOAKS");
    const [category, setCategory]           = useState("Umum");
    const [description, setDescription]     = useState("");
    const [author, setAuthor]               = useState("Tim Investigasi RCF");
    const [analisis, setAnalisis]           = useState("");
    const [visualLabel, setVisualLabel]     = useState("");
    const [visualDesc, setVisualDesc]       = useState("");
    const [kesimpulanTitle, setKesimpulanTitle] = useState("");
    const [kesimpulanDesc, setKesimpulanDesc]   = useState("");
    const [standar, setStandar]             = useState("IFCN Compliance");

    // Image state
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [imageFile, setImageFile]         = useState(null);
    const [imagePreview, setImagePreview]   = useState("");
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    // Load artikel berdasarkan slug
    useEffect(() => {
        if (!slug) return;
        const fetchArticle = async () => {
            const { data, error: fetchError } = await supabase
                .from("hoax_db")
                .select("*")
                .eq("slug", slug)
                .single();

            if (fetchError || !data) {
                setError("Artikel tidak ditemukan.");
                setLoading(false);
                return;
            }

            setArticleId(data.id);
            setTitle(data.title || "");
            setEditSlug(data.slug || "");
            setStatus(data.status || "HOAKS");
            setCategory(data.category || "Umum");
            setDescription(data.description || "");
            setAuthor(data.author || "Tim Investigasi RCF");
            setAnalisis((data.analisis_paragraphs || []).join("\n\n"));
            setVisualLabel(data.visual_image_label || "");
            setVisualDesc(data.visual_description || "");
            setKesimpulanTitle(data.kesimpulan_title || "");
            setKesimpulanDesc(data.kesimpulan_description || "");
            setStandar(data.rincian_standar || "IFCN Compliance");
            setExistingImageUrl(data.visual_image_url || "");
            setLoading(false);
        };
        fetchArticle();
    }, [slug]);

    // Image handlers
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
        setRemoveExistingImage(false);
    };

    const handleRemoveNewImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleRemoveExistingImage = () => {
        setRemoveExistingImage(true);
    };

    const handleRestoreExistingImage = () => {
        setRemoveExistingImage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (!title || !editSlug || !description || !kesimpulanTitle || !kesimpulanDesc) {
            setError("Lengkapi semua field yang wajib diisi (*).");
            setSaving(false);
            return;
        }

        const analisisParagraphs = analisis
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean);

        // Tentukan final URL gambar
        let visual_image_url = existingImageUrl;

        // Jika ada file baru → upload
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

        // Jika admin sengaja hapus gambar lama
        if (removeExistingImage && !imageFile) {
            visual_image_url = null;
        }

        const { error: updateError } = await supabase
            .from("hoax_db")
            .update({
                slug: editSlug,
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
            })
            .eq("id", articleId);

        if (updateError) {
            setError(`Gagal menyimpan perubahan: ${updateError.message}`);
            setSaving(false);
            return;
        }

        setSuccess(true);
        setTimeout(() => router.push("/admin/artikel"), 1800);
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-mono text-sm">Memuat artikel...</p>
                </div>
            </div>
        );
    }

    // ── Article not found ──
    if (!articleId && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-5xl font-extrabold text-slate-200 mb-4">404</p>
                    <p className="text-slate-600 mb-4">Artikel tidak ditemukan atau slug tidak valid.</p>
                    <Link href="/admin/artikel" className="text-teal-700 font-semibold text-sm hover:underline">
                        ← Kembali ke Kelola Artikel
                    </Link>
                </div>
            </div>
        );
    }

    // ── Success ──
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Artikel Berhasil Diperbarui!</h2>
                    <p className="text-slate-500 text-sm">Mengalihkan ke halaman Kelola Artikel...</p>
                </div>
            </div>
        );
    }

    // ── Determine image display ──
    const showExistingImage = existingImageUrl && !removeExistingImage && !imagePreview;
    const showNewPreview    = !!imagePreview;
    const showRemoved       = existingImageUrl && removeExistingImage && !imagePreview;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/admin" className="hover:text-teal-700 transition-colors">Dashboard Admin</Link>
                    <span>›</span>
                    <Link href="/admin/artikel" className="hover:text-teal-700 transition-colors">Kelola Artikel</Link>
                    <span>›</span>
                    <span className="text-slate-900 font-medium truncate max-w-xs">{title || "Edit Artikel"}</span>
                </nav>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900">Edit Artikel</h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-mono">/cek-fakta/{editSlug}</p>
                    </div>
                    <Link
                        href={`/cek-fakta/${editSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 border border-slate-200 hover:border-teal-300 px-3 py-2 rounded-lg transition-colors bg-white"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat di Site
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Bagian 1: Metadata ── */}
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
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                required
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white"
                            />
                            <p className="text-xs text-slate-400 mt-1">URL: /cek-fakta/<strong>{editSlug || "slug-artikel"}</strong></p>
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
                                Ringkasan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={2}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* ── Bagian 2: Isi Artikel ── */}
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

                        {/* Upload / Ganti Gambar */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Gambar Verifikasi
                                <span className="ml-2 text-slate-400 font-normal normal-case">(JPG/PNG/WEBP · Maks. 5MB)</span>
                            </label>

                            {/* Gambar baru (preview file yang dipilih) */}
                            {showNewPreview && (
                                <div className="relative rounded-xl overflow-hidden border border-teal-200 bg-slate-50">
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            Gambar Baru
                                        </span>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL lokal dari file upload */}
                                    <img src={imagePreview} alt="Preview baru" className="w-full max-h-64 object-contain" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                                            Ganti
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleRemoveNewImage}
                                            className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {imageFile?.name} · {imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            )}

                            {/* Gambar lama yang masih aktif */}
                            {showExistingImage && (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            Gambar Saat Ini
                                        </span>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL lokal dari file upload */}
                                    <img src={existingImageUrl} alt="Gambar artikel saat ini" className="w-full max-h-64 object-contain" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                                            Ganti Gambar
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleRemoveExistingImage}
                                            className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Gambar dihapus (belum ada pengganti) */}
                            {showRemoved && (
                                <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-red-600">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="text-sm font-medium">Gambar akan dihapus saat disimpan</span>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button type="button" onClick={handleRestoreExistingImage} className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-3 py-1.5 rounded-lg transition-colors">
                                            Batalkan
                                        </button>
                                        <label className="cursor-pointer text-xs font-medium text-teal-700 hover:text-teal-900 border border-teal-200 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                                            Ganti dengan Gambar Baru
                                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Tidak ada gambar sama sekali */}
                            {!showExistingImage && !showNewPreview && !showRemoved && (
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors group">
                                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-teal-600 transition-colors">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <p className="text-sm">
                                            <span className="font-semibold text-teal-600">Klik untuk mengunggah</span> atau seret &amp; lepas
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

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-3">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 pb-8">
                        <Link
                            href="/admin/artikel"
                            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                        >
                            ← Batal, kembali ke Kelola Artikel
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
                            {uploadingImage ? "Mengunggah gambar..." : saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EditArtikelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500 font-mono text-sm">Memuat form edit...</div>
            </div>
        }>
            <EditArtikelForm />
        </Suspense>
    );
}
