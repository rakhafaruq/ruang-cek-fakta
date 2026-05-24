import StatusBadge from "./StatusBadge";

export default function ReportItem({ report }) {
    const dateStr = new Date(report.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/80 transition-colors">
            <div className="flex-shrink-0">
                {report.evidence_img ? (
                    <img src={report.evidence_img} alt="Bukti" className="w-full md:w-32 h-32 md:h-24 rounded-lg object-cover border border-slate-200" />
                ) : (
                    <div className="w-full md:w-32 h-32 md:h-24 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusBadge status={report.status} />
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{report.platform}</span>
                    <span className="text-xs text-slate-400 ml-auto md:ml-0">{dateStr}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{report.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{report.description}</p>
            </div>
        </div>
    );
}
