"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Wrapper yang secara kondisional merender Navbar dan Footer publik.
 * Halaman di bawah /admin menggunakan layout dan navbar mereka sendiri
 * sehingga Navbar & Footer publik harus disembunyikan.
 */
export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");

    if (isAdminRoute) {
        // Di halaman admin: tidak ada Navbar/Footer publik, tidak ada pt-16
        // Admin layout.js bertanggung jawab atas seluruh tampilannya
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
        </>
    );
}
