export default function StatusBadge({ status }) {
  const configs = {
    pending: { label: "Menunggu", css: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    investigating: { label: "Diproses", css: "bg-blue-100 text-blue-800 border-blue-200" },
    hoaks: { label: "Hoaks", css: "bg-red-100 text-red-800 border-red-200" },
    fakta: { label: "Fakta Valid", css: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    menyesatkan: { label: "Menyesatkan", css: "bg-orange-100 text-orange-800 border-orange-200" },
  };

  const current = configs[status?.toLowerCase()] || { label: "Unknown", css: "bg-slate-100 text-slate-800 border-slate-200" };

  return (
    <span className={`${current.css} border text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
      {current.label}
    </span>
  );
}