import HeroSearch from "@/components/HeroSearch";
import HoaxList from "@/components/HoaxList";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <HeroSearch />
      <HoaxList />
    </div>
  );
}
