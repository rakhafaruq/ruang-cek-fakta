import { NextResponse } from 'next/server';

/**
 * proxy.js — Next.js 16 (pengganti middleware.js)
 *
 * CATATAN PENTING:
 * Supabase JS v2 (@supabase/supabase-js) menyimpan session di localStorage browser,
 * BUKAN di cookie HTTP. Karena proxy berjalan di server (Edge Runtime), ia tidak bisa
 * membaca localStorage. Akibatnya, pengecekan session di sini akan selalu gagal
 * meskipun user sudah login → menyebabkan redirect loop ke halaman login.
 *
 * Solusi: Auth guard dilakukan sepenuhnya di sisi CLIENT menggunakan
 * supabase.auth.getSession() di masing-masing halaman protected.
 * File ini hanya meneruskan semua request tanpa modifikasi.
 *
 * Jika ingin proteksi level server di masa depan, gunakan @supabase/ssr
 * yang menyimpan session di cookie HttpOnly.
 */
export function proxy(request) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
