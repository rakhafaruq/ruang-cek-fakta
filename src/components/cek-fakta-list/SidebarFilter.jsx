export default function SidebarFilter({
  selectedStatus,
  setSelectedStatus,
  selectedCategories,
  setSelectedCategories,
}) {
  const statuses = ["Semua", "Hoaks", "Fakta", "Menyesatkan"];
  const categories = ["Politik", "Kesehatan", "Ekonomi", "Sosial"];

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="w-full lg:w-64 shrink-0 pr-0 lg:pr-8 mb-8 lg:mb-0 text-brand-text">
      <h2 className="text-xl font-bold mb-6">Filter Pencarian</h2>

      {/* Status Filter */}
      <div className="mb-8">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">
          Status
        </h3>
        <div className="space-y-3">
          {statuses.map((status) => (
            <label key={status} className="flex items-center cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                  className="appearance-none w-4 h-4 rounded-full border border-slate-300 checked:border-brand-cyan transition-colors"
                />
                {selectedStatus === status && (
                  <div className="absolute w-2 h-2 bg-brand-cyan rounded-full"></div>
                )}
              </div>
              <span className="ml-3 text-sm text-slate-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full mb-8"></div>

      {/* Kategori Filter */}
      <div>
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">
          Kategori
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="appearance-none w-4 h-4 rounded border border-slate-300 checked:bg-brand-cyan checked:border-brand-cyan transition-colors"
                />
                {selectedCategories.includes(category) && (
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-sm text-slate-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
