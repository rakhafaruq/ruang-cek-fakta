import Link from "next/link";

export default function RelatedFacts({ facts }) {
  const getBadgeStyle = (status) => {
    switch (status) {
      case "FAKTA":
        return "bg-teal-700 text-white";
      case "HOAKS":
        return "bg-red-700 text-white";
      case "MENYESATKAN":
        return "bg-amber-700 text-white";
      default:
        return "bg-slate-700 text-white";
    }
  };

  const getBadgeIcon = (status) => {
    switch (status) {
      case "FAKTA":
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "HOAKS":
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "MENYESATKAN":
        return (
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-200">
      <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
        <svg className="w-6 h-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Cek Fakta Terkait
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facts.map((fact) => (
          <div key={fact.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col h-full">
            
            {/* Image Area Placeholder */}
            <div className="bg-indigo-50/50 aspect-video relative">
              <div className={`absolute top-4 left-4 inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded ${getBadgeStyle(fact.status)}`}>
                {getBadgeIcon(fact.status)}
                {fact.status}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase flex items-center gap-2">
                <span>{fact.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{fact.date}</span>
              </div>
              
              <h3 className="font-bold text-brand-text text-sm leading-snug mb-4 group-hover:text-brand-cyan transition-colors line-clamp-3">
                {fact.title}
              </h3>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link href={fact.url} className="text-xs font-semibold text-brand-cyan hover:text-cyan-700 flex items-center gap-1">
                  Baca Laporan
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
