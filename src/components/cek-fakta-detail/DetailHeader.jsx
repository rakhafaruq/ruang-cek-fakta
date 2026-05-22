export default function DetailHeader({ header }) {
  const isHoaks = header.status === "HOAKS";
  
  return (
    <div className={`rounded-xl p-8 mb-8 ${isHoaks ? "bg-red-50" : "bg-cyan-50"}`}>
      {/* Status Badge */}
      <div
        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full mb-6 ${
          isHoaks ? "bg-red-700 text-white" : "bg-cyan-700 text-white"
        }`}
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isHoaks ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        STATUS: {header.status}
      </div>

      {/* Title */}
      <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${isHoaks ? "text-red-900" : "text-brand-text"}`}>
        {header.title}
      </h1>

      {/* Meta (Date & Author) */}
      <div className={`flex flex-wrap items-center gap-6 text-sm font-mono ${isHoaks ? "text-red-700/80" : "text-brand-text-muted"}`}>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {header.date}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Oleh: {header.author}
        </div>
      </div>
    </div>
  );
}
