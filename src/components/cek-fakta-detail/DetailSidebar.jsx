export default function DetailSidebar({ sidebar }) {
  return (
    <div className="space-y-6">
      {/* Rincian Verifikasi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 mb-4 uppercase">
          Rincian Verifikasi
        </h3>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Kategori</div>
              <div className="text-sm font-medium text-brand-text">{sidebar.rincian.kategori}</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Terakhir Diperbarui</div>
              <div className="text-sm font-medium text-brand-text">{sidebar.rincian.terakhirDiperbarui}</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Standar Metodologi</div>
              <div className="text-sm font-medium text-brand-cyan hover:underline cursor-pointer">{sidebar.rincian.standar}</div>
            </div>
          </li>
        </ul>
      </div>

      {/* Bagikan Laporan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 mb-4 uppercase">
          Bagikan Laporan
        </h3>
        
        <div className="flex gap-3">
          <button className="flex-1 py-2 px-4 border border-slate-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-slate-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Link
          </button>
          <button className="flex-1 py-2 px-4 border border-slate-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors text-slate-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Kirim
          </button>
        </div>
      </div>
      
    </div>
  );
}
