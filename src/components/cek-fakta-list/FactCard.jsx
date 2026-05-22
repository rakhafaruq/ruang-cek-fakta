import Link from "next/link";

export default function FactCard({ fact }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case "HOAKS":
        return {
          pill: "bg-red-100 text-red-700",
          dot: "bg-red-600",
        };
      case "FAKTA":
        return {
          pill: "bg-teal-700 text-white", // in the image it looks green with white text
          dot: "hidden", // Fakta badge in image doesn't seem to have a dot, or maybe it does? Mockup says bg is dark green. Let's make it match mockup.
        };
      case "MENYESATKAN":
        return {
          pill: "bg-[#9A5B3D] text-white", // brownish
          dot: "bg-amber-300",
        };
      default:
        return { pill: "bg-slate-100 text-slate-700", dot: "bg-slate-500" };
    }
  };

  // Re-adjusting to better match the exact image:
  // "HOAKS" is red text on very light red/pink bg with red dot.
  // "FAKTA" is white text on teal/dark green bg.
  // "MENYESATKAN" is white text on brown bg with an orange/yellow dot.
  
  const statusStyles = (status) => {
    if (status === "HOAKS") return "bg-red-100 text-red-700";
    if (status === "FAKTA") return "bg-brand-cyan text-white"; // using brand-cyan (0891B2) or teal
    if (status === "MENYESATKAN") return "bg-[#A75B46] text-white"; 
    return "bg-slate-100 text-slate-700";
  }

  const dotColor = (status) => {
    if (status === "HOAKS") return "bg-red-600";
    if (status === "MENYESATKAN") return "bg-amber-200";
    return "hidden"; // No dot for FAKTA in mockup? Wait, actually Fakta doesn't have a dot in the mockup.
  }

  return (
    <div className="bg-white p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Header: Status and Time */}
      <div className="flex justify-between items-center mb-4">
        <div className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusStyles(fact.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor(fact.status)}`}></span>
          {fact.status}
        </div>
        <span className="text-[10px] font-mono text-slate-500">{fact.date}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3">
        {fact.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
        {fact.description}
      </p>

      {/* Action Link */}
      <div className="mt-auto pt-4">
        <Link href={fact.url} className="text-xs font-semibold text-brand-cyan hover:text-cyan-800 flex items-center gap-1 group">
          Baca Cek Fakta
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
