import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
  description: "Aksi nyata edukasi publik dan validasi informasi untuk mendukung pencapaian SDG 16.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* 'flex flex-col min-h-screen' memastikan footer tetap berada di bawah layar meskipun konten halaman sedang sedikit */}
      <body className="antialiased font-sans flex flex-col min-h-screen">
        
        {/* Navigasi Utama (Tetap di atas karena menggunakan class 'fixed') */}
        <Navbar />
        
        {/* Area Konten Utama Halaman (Diberi padding-top 'pt-16' agar tidak tertutup oleh Navbar) */}
        <main className="flex-grow pt-16">
          {children}
        </main>
        
        {/* Footer Global */}
        <Footer />
        
      </body>
    </html>
  );
}