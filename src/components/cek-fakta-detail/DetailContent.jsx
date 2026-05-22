export default function DetailContent({ content }) {
  return (
    <div className="space-y-10 text-brand-text">
      
      {/* Analisis Sumber Klaim */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Analisis Sumber Klaim
        </h2>
        <div className="space-y-4 leading-relaxed text-slate-700">
          {content.analisis.paragraphs.map((text, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </div>
      </section>

      {/* Verifikasi Visual */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Verifikasi Visual
        </h2>
        
        {/* Placeholder Image */}
        <div className="bg-indigo-100 rounded-xl aspect-video flex items-center justify-center relative mb-6 overflow-hidden border border-indigo-50">
           <svg className="w-16 h-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-mono px-3 py-1.5 rounded-md text-indigo-900 font-medium">
             {content.visual.imagePlaceholder}
           </div>
        </div>
        
        <p className="leading-relaxed text-slate-700">
          {content.visual.description}
        </p>
      </section>

      {/* Kesimpulan */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Kesimpulan
        </h2>
        
        <div className="bg-slate-50 border-l-4 border-red-600 rounded-r-xl p-6">
          <p className="font-bold text-brand-text mb-3">
            {content.kesimpulan.title}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {content.kesimpulan.description}
          </p>
        </div>
      </section>
      
    </div>
  );
}
