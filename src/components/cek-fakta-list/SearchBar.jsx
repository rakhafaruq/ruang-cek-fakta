export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="flex w-full mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan transition-colors bg-white text-slate-700 placeholder-slate-400"
          placeholder="Cari laporan cek fakta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className="bg-brand-cyan hover:bg-cyan-700 text-white px-8 py-3 font-semibold transition-colors shrink-0">
        Cari
      </button>
    </div>
  );
}
