import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

export const metadata = {
  title: {
    default: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
    template: "%s | Ruang Cek Fakta",
  },
  description: "Aksi nyata edukasi publik dan validasi informasi untuk mendukung pencapaian SDG 16. Cek fakta, laporkan hoaks, dan tingkatkan literasi digital Anda.",
  metadataBase: new URL("https://ruangcekfakta.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ruangcekfakta.id",
    siteName: "Ruang Cek Fakta",
    title: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
    description: "Validasi informasi instan, cek fakta, dan kembangkan literasi digital Anda bersama Ruang Cek Fakta.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ruang Cek Fakta — Platform Literasi Digital & Anti-Hoaks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruang Cek Fakta | Platform Literasi Digital & Anti-Hoaks",
    description: "Validasi informasi instan, cek fakta, dan kembangkan literasi digital Anda bersama Ruang Cek Fakta.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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