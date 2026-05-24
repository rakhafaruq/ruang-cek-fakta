"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import Breadcrumbs from "@/components/cek-fakta-detail/Breadcrumbs";
import DetailHeader from "@/components/cek-fakta-detail/DetailHeader";
import DetailContent from "@/components/cek-fakta-detail/DetailContent";
import DetailSidebar from "@/components/cek-fakta-detail/DetailSidebar";
import RelatedFacts from "@/components/cek-fakta-detail/RelatedFacts";

export default function CekFaktaDetail() {
    const { id: slug } = useParams(); // URL param bernama [id] tapi berisi slug

    const [article, setArticle] = useState(null);
    const [relatedFacts, setRelatedFacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound404, setNotFound404] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);

            // Fetch artikel berdasarkan slug
            const { data, error } = await supabase
                .from("hoax_db")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error || !data) {
                setNotFound404(true);
                setLoading(false);
                return;
            }

            setArticle(data);

            // Fetch artikel terkait (kategori sama, kecuali artikel ini, maks 6)
            const { data: related } = await supabase
                .from("hoax_db")
                .select("id, slug, status, category, title, description, published_at")
                .eq("category", data.category)
                .neq("slug", slug)
                .order("published_at", { ascending: false })
                .limit(3);

            // Juga ambil artikel terbaru agar total 6 item (tanpa duplikat)
            const { data: latest } = await supabase
                .from("hoax_db")
                .select("id, slug, status, category, title, description, published_at")
                .neq("slug", slug)
                .order("published_at", { ascending: false })
                .limit(6);

            // Gabungkan dan deduplikasi
            const combined = [...(related || []), ...(latest || [])];
            const seen = new Set();
            const unique = combined.filter((item) => {
                if (seen.has(item.id)) return false;
                seen.add(item.id);
                return true;
            }).slice(0, 6);

            // Format untuk RelatedFacts (butuh .url dan .date)
            const formattedRelated = unique.map((item) => ({
                ...item,
                url: `/cek-fakta/${item.slug}`,
                date: new Date(item.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            }));

            setRelatedFacts(formattedRelated);
            setLoading(false);
        };

        if (slug) fetchArticle();
    }, [slug]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-brand-bg">
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 pt-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-4 bg-slate-200 rounded w-48"></div>
                        <div className="space-y-3">
                            <div className="h-6 bg-slate-200 rounded w-20"></div>
                            <div className="h-8 bg-slate-200 rounded w-full"></div>
                            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 bg-slate-100 rounded w-full"></div>
                                ))}
                            </div>
                            <div className="h-48 bg-slate-100 rounded-xl"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // 404 jika artikel tidak ditemukan
    if (notFound404 || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="text-center">
                    <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Artikel Tidak Ditemukan</h2>
                    <p className="text-slate-500">Artikel yang Anda cari tidak ada atau telah dihapus.</p>
                    <a href="/cek-fakta" className="mt-6 inline-block text-teal-700 font-semibold underline">
                        Kembali ke Cek Fakta
                    </a>
                </div>
            </div>
        );
    }

    // Transform data dari Supabase ke format yang diharapkan komponen lama
    const headerData = {
        status: article.status,
        title: article.title,
        date: new Date(article.published_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }),
        author: article.author,
    };

    const contentData = {
        analisis: {
            paragraphs: Array.isArray(article.analisis_paragraphs)
                ? article.analisis_paragraphs
                : JSON.parse(article.analisis_paragraphs || "[]"),
        },
        visual: {
            imagePlaceholder: article.visual_image_label || "Dokumen Verifikasi Visual",
            description: article.visual_description || "",
        },
        kesimpulan: {
            title: article.kesimpulan_title,
            description: article.kesimpulan_description,
        },
    };

    const sidebarData = {
        rincian: {
            kategori: article.category,
            terakhirDiperbarui: new Date(article.updated_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " WIB",
            standar: article.rincian_standar,
        },
        bagikan: {
            link: `https://ruangcekfakta.id/cek-fakta/${article.slug}`,
        },
    };

    const breadcrumbData = [
        { label: "Beranda", url: "/" },
        { label: "Cek Fakta", url: "/cek-fakta" },
        { label: article.title.substring(0, 50) + (article.title.length > 50 ? "..." : ""), url: "#" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-brand-bg">
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
                <Breadcrumbs items={breadcrumbData} />
                <DetailHeader header={headerData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Konten Utama */}
                    <div className="lg:col-span-2">
                        <DetailContent content={contentData} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <DetailSidebar sidebar={sidebarData} />
                        </div>
                    </div>
                </div>

                <RelatedFacts facts={relatedFacts} />
            </main>
        </div>
    );
}
