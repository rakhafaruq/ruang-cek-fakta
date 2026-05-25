import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

export const metadata = {
  title: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
  description: "Aksi nyata edukasi publik dan validasi informasi untuk mendukung pencapaian SDG 16.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        {/*
          PublicLayout secara otomatis menyembunyikan Navbar & Footer publik
          ketika user berada di halaman /admin, karena admin punya layout sendiri.
        */}
        <PublicLayout>
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}