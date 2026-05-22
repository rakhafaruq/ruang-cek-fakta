import Breadcrumbs from "@/components/cek-fakta-detail/Breadcrumbs";
import DetailHeader from "@/components/cek-fakta-detail/DetailHeader";
import DetailContent from "@/components/cek-fakta-detail/DetailContent";
import DetailSidebar from "@/components/cek-fakta-detail/DetailSidebar";
import RelatedFacts from "@/components/cek-fakta-detail/RelatedFacts";
import { dummyDetailData, dummyRelatedFacts } from "@/data/dummyDetail";

export default function CekFaktaDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <Breadcrumbs items={dummyDetailData.breadcrumb} />
        
        <DetailHeader header={dummyDetailData.header} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <DetailContent content={dummyDetailData.content} />
          </div>

          {/* Sidebar Area - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <DetailSidebar sidebar={dummyDetailData.sidebar} />
            </div>
          </div>
        </div>

        <RelatedFacts facts={dummyRelatedFacts} />
      </main>
    </div>
  );
}
