"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "@/components/cek-fakta-list/SidebarFilter";
import SearchBar from "@/components/cek-fakta-list/SearchBar";
import FactCard from "@/components/cek-fakta-list/FactCard";
import Pagination from "@/components/cek-fakta-list/Pagination";
import { supabase } from "@/lib/supabaseClient";

const ITEMS_PER_PAGE = 9;

function CekFaktaContent() {
    const searchParams = useSearchParams();
    const [allFacts, setAllFacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "Semua");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Ambil semua data dari Supabase hoax_db
    useEffect(() => {
        const fetchFacts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("hoax_db")
                .select("id, slug, status, category, title, description, published_at, author, visual_image_url")
                .order("published_at", { ascending: false });

            if (!error && data) {
                // Format data agar cocok dengan FactCard (yang mengharapkan field .url dan .date)
                const formatted = data.map((item) => ({
                    ...item,
                    url: `/cek-fakta/${item.slug}`,
                    date: new Date(item.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                }));
                setAllFacts(formatted);
            }
            setLoading(false);
        };

        fetchFacts();
    }, []);

    // Filter Data
    const filteredData = allFacts.filter((item) => {
        const matchStatus = selectedStatus === "Semua" || item.status.toUpperCase() === selectedStatus.toUpperCase();
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const matchSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchCategory && matchSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset halaman saat filter berubah
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };
    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
        setCurrentPage(1);
    };
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-brand-bg pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
                {/* Sidebar Filter */}
                <SidebarFilter
                    selectedStatus={selectedStatus}
                    setSelectedStatus={handleStatusChange}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={handleCategoryChange}
                />

                {/* Main Content */}
                <div className="flex-grow w-full">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearchChange} />

                    {/* Loading Skeleton */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>
                                    <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
                                    <div className="h-5 bg-slate-100 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Info Hasil */}
                            <div className="text-sm text-slate-600 mb-8 font-medium">
                                Menampilkan <strong className="text-slate-900">{filteredData.length}</strong> hasil untuk &quot;{selectedStatus}&quot;
                                {selectedCategories.length > 0 && ` dalam kategori ${selectedCategories.join(", ")}`}
                            </div>

                            {/* Grid Kartu */}
                            {paginatedData.length === 0 ? (
                                <div className="text-center py-20 text-slate-500 bg-white border border-slate-200 rounded-xl">
                                    Tidak ada laporan cek fakta yang sesuai dengan kriteria filter Anda.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedData.map((item) => (
                                        <FactCard key={item.id} fact={item} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CekFaktaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-brand-bg pt-12 pb-24 flex items-center justify-center">
                <div className="animate-pulse text-slate-400 font-mono text-sm">Memuat...</div>
            </div>
        }>
            <CekFaktaContent />
        </Suspense>
    );
}
