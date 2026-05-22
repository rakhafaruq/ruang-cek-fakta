"use client";

import { useState } from "react";
import SidebarFilter from "@/components/cek-fakta-list/SidebarFilter";
import SearchBar from "@/components/cek-fakta-list/SearchBar";
import FactCard from "@/components/cek-fakta-list/FactCard";
import Pagination from "@/components/cek-fakta-list/Pagination";
import { dummyRelatedFacts } from "@/data/dummyDetail";

export default function CekFaktaPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Semua");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data
    const filteredData = dummyRelatedFacts.filter((item) => {
        const matchStatus = selectedStatus === "Semua" || item.status.toUpperCase() === selectedStatus.toUpperCase();
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-brand-bg pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
                {/* Sidebar Left */}
                <SidebarFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />

                {/* Main Content Right */}
                <div className="flex-grow w-full">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                    {/* Result Info Text */}
                    <div className="text-sm text-slate-600 mb-8 font-medium">
                        Menampilkan <strong className="text-slate-900">{filteredData.length}</strong> hasil untuk "{selectedStatus}"{selectedCategories.length > 0 && ` dalam kategori ${selectedCategories.join(", ")}`}
                    </div>

                    {/* Grid of Cards */}
                    {filteredData.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 bg-white border border-slate-200">Tidak ada laporan cek fakta yang sesuai dengan kriteria filter Anda.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredData.map((item) => (
                                <FactCard key={item.id} fact={item} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={3} // Mock total pages
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
