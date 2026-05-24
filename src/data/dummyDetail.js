export const dummyDetailData = {
  id: "1",
  breadcrumb: [
    { label: "Beranda", url: "/" },
    { label: "Cek Fakta", url: "/cek-fakta" },
    { label: "Klaim Vaksin Mengandung Microchip", url: "#" },
  ],
  header: {
    status: "HOAKS",
    title: "Klaim Beredar Bahwa Vaksin Varian Baru Mengandung Pelacak Microchip Aktif",
    date: "12 Agustus 2024",
    author: "Tim Investigasi RCF",
  },
  content: {
    analisis: {
      paragraphs: [
        "Klaim tersebut pertama kali muncul di sebuah grup media sosial tertutup pada awal Agustus 2024, disertai dengan tangkapan layar dokumen yang diklaim sebagai spesifikasi teknis dari pabrikan farmasi. Dokumen tersebut menampilkan diagram skematik sirkuit nano yang diduga dicampur ke dalam cairan vial.",
        "Tim kami menelusuri asal-usul dokumen tersebut menggunakan teknik <strong class='bg-cyan-100 text-cyan-800 px-1 rounded'>Reverse Image Search</strong> dan analisis metadata. Hasilnya menunjukkan bahwa dokumen tersebut telah dimanipulasi secara digital.",
      ],
    },
    visual: {
      imagePlaceholder: "Dokumen Forensik Visual",
      description:
        "Diagram skematik yang disisipkan dalam gambar klaim teridentifikasi sebagai cetak biru desain sensor suhu industri dari tahun 2018, yang tidak memiliki kaitan sama sekali dengan bioteknologi medis atau pembuatan vaksin. Teks asli pada cetak biru telah dihapus dan diganti dengan istilah medis palsu.",
    },
    kesimpulan: {
      title:
        "Berdasarkan investigasi komprehensif, klaim mengenai adanya pelacak microchip dalam varian vaksin baru adalah TIDAK BENAR (HOAKS).",
      description:
        "Bukti yang disajikan oleh penyebar klaim adalah hasil fabrikasi digital menggunakan gambar teknis usang yang tidak relevan. Tidak ada dasar ilmiah maupun bukti material yang mendukung pernyataan tersebut. Masyarakat diimbau untuk selalu memverifikasi informasi medis melalui kanal kesehatan resmi.",
    },
  },
  sidebar: {
    rincian: {
      kategori: "Kesehatan Publik",
      terakhirDiperbarui: "13 Agustus 2024, 09:45 WIB",
      standar: "IFCN Compliance",
    },
    bagikan: {
      link: "https://ruangcekfakta.id/cf/1",
    },
  },
};

export const dummyRelatedFacts = [
  {
    id: 101,
    status: "HOAKS",
    category: "Kesehatan",
    date: "2 jam yang lalu",
    title: "Klaim Vaksin Mengandung Microchip Pelacak",
    description: "Beredar video di media sosial yang mengklaim bahwa vaksin terbaru mengandung microchip untuk melacak pergerakan...",
    url: "/cek-fakta/1",
  },
  {
    id: 102,
    status: "FAKTA",
    category: "Ekonomi",
    date: "5 jam yang lalu",
    title: "Penurunan Suku Bunga Bank Sentral",
    description: "Pernyataan mengenai bank sentral yang menurunkan suku bunga acuan sebesar 0.25% pada kuartal ini telah dikonfirmasi...",
    url: "/cek-fakta/102",
  },
  {
    id: 103,
    status: "MENYESATKAN",
    category: "Sosial",
    date: "1 hari yang lalu",
    title: "Foto Banjir di Ibu Kota Baru",
    description: "Beredar foto yang dinarasikan sebagai banjir bandang di lokasi ibu kota baru. Faktanya, foto tersebut adalah kejadian...",
    url: "/cek-fakta/103",
  },
  {
    id: 104,
    status: "HOAKS",
    category: "Politik",
    date: "2 hari yang lalu",
    title: "Kebijakan Pajak Baru 50% untuk Kelas Menengah",
    description: "Beredar pesan berantai di WhatsApp yang mengklaim pemerintah akan memotong pajak sebesar 50% untuk pekerja kelas menengah...",
    url: "/cek-fakta/104",
  },
  {
    id: 105,
    status: "FAKTA",
    category: "Kesehatan",
    date: "2 hari yang lalu",
    title: "Program Imunisasi Nasional Targetkan 90% Cakupan",
    description: "Kementerian Kesehatan resmi mengumumkan target pencapaian 90% cakupan imunisasi dasar untuk anak di wilayah timur...",
    url: "/cek-fakta/105",
  },
  {
    id: 106,
    status: "MENYESATKAN",
    category: "Teknologi",
    date: "3 hari yang lalu",
    title: "Video Kecerdasan Buatan Diklaim Sebagai Rekaman Asli",
    description: "Sebuah video yang memperlihatkan bencana alam dahsyat viral. Namun setelah dicek forensik, itu adalah hasil render AI...",
    url: "/cek-fakta/106",
  },
];
