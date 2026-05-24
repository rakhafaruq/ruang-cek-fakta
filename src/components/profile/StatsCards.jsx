export default function StatsCards({ stats }) {
  const items = [
    { label: "Total Laporan", value: stats.total, icon: "📋", color: "bg-teal-50 text-teal-700" },
    { label: "Sedang Diproses", value: stats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
    { label: "Laporan Selesai", value: stats.selesai, icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-xl`}>
            {item.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{item.value}</div>
            <div className="text-sm text-slate-500 font-medium">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}