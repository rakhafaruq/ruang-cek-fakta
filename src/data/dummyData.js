// src/data/dummyData.js

export const literasiData = {
    // MODUL 1: DASAR VERIFIKASI
    "dasar-verifikasi": {
        title: "Dasar Verifikasi",
        progress: 25,
        chapters: [
            {
                id: "apa-itu-misinformasi",
                title: "1.1 Apa itu Misinformasi?",
                status: "selesai",
                estimatedTime: "3 Menit",
                content: {
                    paragraphs: [
                        "Sebelum kita bisa melawan hoaks, kita harus memahami anatomi dari informasi palsu itu sendiri. Seringkali kita menyamaratakan semua berita bohong dengan sebutan 'hoaks', padahal dalam literasi digital, kekacauan informasi (information disorder) dibagi menjadi tiga kategori utama berdasarkan niat pembuatnya.",
                        "Memahami perbedaan ini sangat penting karena cara penanganannya pun berbeda. Seseorang yang menyebarkan informasi salah karena ketidaktahuan membutuhkan edukasi, bukan hukuman, berbeda dengan sindikat yang sengaja memproduksi kebohongan untuk tujuan politik atau finansial.",
                    ],
                    principles: [
                        {
                            title: "Misinformasi",
                            desc: "Informasi yang salah, tetapi orang yang membagikannya percaya bahwa itu benar. (Tidak ada niat jahat/merugikan).",
                        },
                        {
                            title: "Disinformasi (Hoaks)",
                            desc: "Informasi yang salah dan sengaja dibuat untuk menipu, memanipulasi, atau merugikan orang, kelompok, atau negara tertentu.",
                        },
                        {
                            title: "Malinformasi",
                            desc: "Informasi yang berdasarkan realita/fakta, tetapi digunakan untuk merugikan seseorang (contoh: penyebaran data pribadi/doxing atau foto masa lalu yang tidak relevan).",
                        },
                    ],
                    tips: "Niat (intent) adalah pembedanya. Jika ibu Anda membagikan resep obat herbal palsu di grup keluarga karena peduli pada kesehatan Anda, beliau sedang menyebarkan Misinformasi, bukan Disinformasi.",
                },
                quiz: {
                    question: "Rekan Anda membagikan tautan lowongan kerja fiktif di grup alumni karena ia benar-benar mengira itu asli dan ingin membantu teman yang menganggur. Tindakan rekan Anda termasuk dalam kategori:",
                    options: [
                        "Disinformasi, karena informasinya 100% salah.",
                        "Misinformasi, karena informasinya salah tetapi tidak ada niat jahat dari rekan Anda.",
                        "Malinformasi, karena lowongan kerja tersebut menggunakan nama perusahaan asli.",
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Tepat! Karena rekan Anda tidak memiliki niat jahat dan murni tertipu, ia adalah agen penyebar Misinformasi. Edukasi dengan sopan adalah cara terbaik untuk meresponsnya.",
                },
            },
            {
                id: "mengidentifikasi-sumber",
                title: "1.2 Mengidentifikasi Sumber",
                status: "aktif",
                estimatedTime: "5 Menit",
                content: {
                    paragraphs: [
                        "Langkah pertama dan paling krusial dalam memverifikasi sebuah klaim adalah mengetahui asal-usulnya. Sumber informasi sering kali menentukan tingkat kredibilitas konten tersebut. Dalam era digital, di mana informasi dapat disalin dan disebarkan dalam hitungan detik, melacak sumber asli membutuhkan pendekatan sistematis.",
                    ],
                    principles: [
                        {
                            title: "Siapa pembuatnya?",
                            desc: "Apakah itu akun resmi, institusi kredibel, atau sekadar akun anonim?",
                        },
                        {
                            title: "Kapan dibuat?",
                            desc: "Konteks waktu sangat penting. Gambar atau video lama sering kali didaur ulang dengan narasi baru.",
                        },
                        {
                            title: "Mengapa dibuat?",
                            desc: "Pahami motif di balik pembuatan konten. Apakah untuk memberikan informasi objektif, memicu emosi (marah/takut), atau tujuan komersial?",
                        },
                    ],
                    tips: "Jangan tertipu oleh tampilan visual yang rapi. Banyak situs penyebar hoaks didesain sedemikian rupa menyerupai portal berita resmi. Selalu periksa URL (alamat web) dengan teliti. Misalnya, membedakan berita-resmi.com dengan berita-resmi.blogspot.com.",
                },
                quiz: {
                    question: "Anda menemukan tangkapan layar sebuah artikel berita sensasional di grup WhatsApp, tetapi tidak disertai tautan (link). Langkah pertama apa yang paling tepat untuk memverifikasinya?",
                    options: [
                        "Mencari judul artikel tersebut di mesin pencari (Google/Bing) untuk menemukan sumber aslinya.",
                        "Langsung membagikan ke grup lain untuk bertanya apakah berita tersebut benar.",
                        "Percaya begitu saja karena yang mengirim adalah anggota keluarga yang tepercaya.",
                    ],
                    correctAnswerIndex: 0,
                    explanation: "Tepat sekali! Mencari sumber asli melalui mesin pencari adalah langkah pertama yang krusial (Lateral Reading). Membagikan tanpa verifikasi justru berisiko menyebarkan hoaks.",
                },
            },
            {
                id: "reverse-image-search",
                title: "1.3 Reverse Image Search",
                status: "terkunci",
                estimatedTime: "7 Menit",
            },
            {
                id: "analisis-metadata",
                title: "1.4 Analisis Metadata",
                status: "terkunci",
                estimatedTime: "10 Menit",
            },
        ],
    },

    // MODUL 2: KEAMANAN DIGITAL
    "keamanan-digital": {
        title: "Keamanan Digital",
        progress: 50,
        chapters: [
            {
                id: "mengenal-phishing",
                title: "2.1 Mengenal Phishing",
                status: "aktif",
                estimatedTime: "5 Menit",
                content: {
                    paragraphs: [
                        "Selain berita palsu, ancaman terbesar di dunia digital adalah penipuan yang menargetkan data pribadi Anda. Teknik yang paling umum digunakan adalah 'Phishing' (pengelabuan).",
                        "Phishing adalah upaya mendapatkan informasi sensitif seperti kata sandi, PIN, atau data kartu kredit dengan cara menyamar sebagai entitas yang tepercaya (seperti bank, perusahaan kurir, atau platform e-commerce) melalui email, SMS, atau WhatsApp.",
                    ],
                    principles: [
                        {
                            title: "Sense of Urgency (Tendesius/Mendesak)",
                            desc: "Pesan phishing selalu mencoba membuat Anda panik. Contoh: 'Rekening Anda akan diblokir dalam 24 jam jika tidak mengklik tautan ini!'",
                        },
                        {
                            title: "Tautan (Link) Menyesatkan",
                            desc: "Pelaku menggunakan URL yang dimiripkan dengan aslinya (Typosquatting), misalnya 'www.klikbca-login.com' alih-alih 'www.klikbca.com'.",
                        },
                        {
                            title: "Permintaan Kode OTP",
                            desc: "OTP (One Time Password) adalah kunci brankas Anda. Institusi resmi TIDAK AKAN PERNAH meminta OTP Anda dengan alasan apa pun.",
                        },
                    ],
                    tips: "Jika Anda menerima pesan APK berkedok undangan pernikahan atau resi paket dari nomor tidak dikenal, JANGAN PERNAH mengunduh atau menginstalnya. Itu adalah malware yang bisa menguras rekening Anda.",
                },
                quiz: {
                    question:
                        "Anda menerima SMS yang menyatakan Anda memenangkan undian dari platform belanja online. SMS tersebut mengarahkan Anda untuk mengklik sebuah tautan dan memasukkan nomor HP serta kode OTP. Apa yang harus Anda lakukan?",
                    options: [
                        "Mengklik tautan tersebut untuk mengecek kebenarannya, tetapi tidak memasukkan OTP.",
                        "Memasukkan data yang diminta karena penasaran dengan hadiahnya.",
                        "Mengabaikan SMS tersebut, memblokir nomor pengirim, dan tidak mengklik tautan sama sekali.",
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Sangat tepat! Mengklik tautan phishing saja sudah berisiko (bisa memicu unduhan malware otomatis). Mengabaikan dan memblokir adalah pertahanan terbaik.",
                },
            },
            {
                id: "manajemen-password",
                title: "2.2 Manajemen Password",
                status: "terkunci",
                estimatedTime: "4 Menit",
            },
        ],
    },

    // MODUL 3: BERPIKIR KRITIS
    "berpikir-kritis": {
        title: "Berpikir Kritis",
        progress: 0,
        chapters: [
            {
                id: "bias-kognitif",
                title: "3.1 Bias Kognitif",
                status: "aktif",
                estimatedTime: "6 Menit",
                content: {
                    paragraphs: [
                        "Mengapa orang yang berpendidikan tinggi sekalipun bisa mempercayai hoaks? Jawabannya ada pada psikologi manusia, secara spesifik: Bias Kognitif.",
                        "Otak kita dirancang untuk memproses informasi dengan cepat agar tidak kewalahan. Sayangnya, 'jalan pintas' mental ini sering kali membuat kita mengabaikan logika dan fakta yang sebenarnya, terutama jika informasi tersebut menyentuh emosi atau keyakinan kita.",
                    ],
                    principles: [
                        {
                            title: "Confirmation Bias (Bias Konfirmasi)",
                            desc: "Kecenderungan untuk hanya mempercayai informasi yang mendukung keyakinan pribadi, dan mengabaikan fakta yang bertentangan.",
                        },
                        {
                            title: "Echo Chamber (Ruang Gema)",
                            desc: "Kondisi di media sosial di mana Anda hanya berteman dan berinteraksi dengan orang-orang yang memiliki pandangan sama, sehingga Anda mengira itulah realitas absolut.",
                        },
                        {
                            title: "Bandwagon Effect",
                            desc: "Percaya bahwa sebuah klaim itu benar hanya karena 'sudah banyak orang yang membagikannya' (viralitas).",
                        },
                    ],
                    tips: "Keluar dari ruang gema Anda! Sesekali, bacalah artikel opini atau ikuti akun kredibel yang memiliki sudut pandang politik atau sosial yang berlawanan dengan Anda untuk melatih objektivitas otak.",
                },
                quiz: {
                    question:
                        "Seseorang sangat membenci tokoh politik A. Suatu hari, ia melihat artikel yang berisi tuduhan korupsi tanpa bukti yang jelas terhadap tokoh A. Ia langsung membagikan artikel tersebut tanpa mengecek kebenarannya karena merasa 'ini pasti benar'. Fenomena apa yang sedang terjadi?",
                    options: ["Bandwagon Effect", "Confirmation Bias", "Echo Chamber"],
                    correctAnswerIndex: 1,
                    explanation: "Benar sekali! Ia mengalami Confirmation Bias, di mana ia menerima klaim tersebut secara mentah-mentah hanya karena sesuai dengan kebencian/opini yang sudah ia miliki sebelumnya.",
                },
            },
        ],
    },
};
