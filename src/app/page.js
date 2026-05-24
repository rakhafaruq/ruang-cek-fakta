import HeroSearch from "@/components/HeroSearch";
import HoaxList from "@/components/HoaxList";
import StatsSection from "@/components/StatsSection";

export const metadata = {
    title: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
    description: "Validasi informasi instan, cek fakta, dan kembangkan literasi digital Anda bersama Ruang Cek Fakta.",
};

export default function Home() {
    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Hero Section dengan AI Search */}
            <HeroSearch />

            {/* Statistik Live */}
            <StatsSection />

            {/* Pantauan Hoaks Terkini */}
            <HoaxList />
        </div>
    );
}
