import type { Dictionary } from '../types';

export const idDictionary: Dictionary = {
  common: {
    localeName: 'Indonesia',
    loading: 'Memuat...',
    openLink: 'Buka tautan',
  },
  nav: {
    labs: 'Labs',
    notes: 'Catatan',
    about: 'Tentang',
    privacy: 'Privasi',
    github: 'GitHub',
    menuTitle: 'Menu Navigasi',
    openMenu: 'Buka menu navigasi',
    closeMenu: 'Tutup menu navigasi',
    toggleLanguage: 'Pilih Bahasa',
  },
  home: {
    badge: 'INDIE SOFTWARE LAB',
    tagline: 'A place for things in progress.',
    description:
      'Ruang kerja independen untuk membangun, menguji, dan mendokumentasikan produk digital.',
    selectedProjectsHeading: 'Selected Projects',
    selectedProjectsSub: 'Eksperimen, prototipe, dan produk digital aktif',
    viewAllProjects: 'Lihat semua',
    recentNotesHeading: 'Recent Notes & Logs',
    recentNotesSub: 'Dokumentasi keputusan teknis, arsitektur, dan pembelajaran',
    viewAllNotes: 'Semua catatan',
    methodLabel: 'Prinsip Kerja — The Tinkerbench Method',
    methodText: 'Urutan prioritas di Tinkerbench tidak pernah dibalik: ',
    methodHighlight: 'bangun satu proyek nyata → uji dengan kondisi sebenarnya → dokumentasikan prosesnya → publikasikan',
    methodEnd: '. Bukan etalase klaim tanpa kode yang berjalan.',
    readAboutLab: 'Baca selengkapnya tentang lab →',
  },
  footer: {
    tagline: 'A place for things in progress.',
    rights: '© 2026 Tinkerbench Labs. All works in progress.',
    builtWith: 'Dibangun dengan Next.js 16 & Supabase · Warm Editorial Workshop',
  },
  labs: {
    badge: 'Direktori Proyek',
    title: 'Labs',
    description:
      'Koleksi proyek perangkat lunak: mulai dari Concept (ide & prototipe eksperimen) hingga Production (aplikasi stabil & siap pakai).',
    filterStatus: 'Status:',
    filterCategory: 'Kategori:',
    filterTag: 'Tag:',
    allStatus: 'Semua Status',
    allCategories: 'Semua Kategori',
    searchPlaceholder: 'Cari berdasarkan judul, kategori, atau tag (misal: photography, retail)...',
    searchLabel: 'Cari proyek',
    resetFilter: 'Reset Filter',
    noProjects: 'Tidak ada proyek yang sesuai dengan filter pencarian.',
    noProjectsSub: 'Coba ubah kata kunci atau reset filter status dan jenis proyek di atas.',
    categories: {
      web_app: 'Web App',
      pwa: 'PWA',
      saas: 'SaaS',
      ecommerce: 'E-Commerce',
      landing_page: 'Landing Page',
    },
    maturities: {
      concept: 'CONCEPT',
      production: 'PRODUCTION',
    },
  },
  notes: {
    badge: 'Jurnal & Catatan Teknis',
    title: 'Notes',
    description:
      'Catatan langsung dari proses pengerjaan: mengapa suatu teknologi dipilih, trade-off arsitektur, kegagalan eksperimen, dan rilis progres terkini.',
    searchLabel: 'Cari catatan',
    searchPlaceholder: 'Cari topik teknis atau catatan build log...',
    pageOf: 'Halaman {current} dari {total}',
    prevPage: '← Sebelumnya',
    nextPage: 'Selanjutnya →',
    noNotes: 'Belum ada catatan yang sesuai dengan pencarian Anda.',
    noNotesSub: 'Lihat prototipe dan proyek yang sedang kami kerjakan di direktori Labs.',
    openLabsBtn: 'Buka Direktori Labs →',
    minRead: 'menit baca',
  },
  about: {
    badge: 'INDEPENDENT SOFTWARE LAB',
    title: 'Tentang Tinkerbench Labs',
    tagline: 'A place for things in progress',
    introLead:
      'Tinkerbench adalah lab software independen untuk membangun, menguji, dan mendokumentasikan produk digital pribadi.',
    originHeading: 'A place for things in progress',
    originP1:
      'Banyak ide aplikasi berhenti di tahap angan-angan atau terkubur di direktori lokal komputer tanpa pernah melihat dunia nyata. Tinkerbench dibuat sebagai meja kerja terbuka (workshop bench): tempat di mana ide ditransformasikan menjadi aplikasi konkret yang bisa diuji langsung oleh pengguna.',
    originP2Lead: 'Meskipun berstatus lab independen, ',
    originP2Bold: 'saya sangat terbuka untuk kerja sama profesional dan proyek klien.',
    originP2Mid:
      ' Jika Anda melihat prototipe, arsitektur, atau sistem di sini yang relevan dengan kebutuhan bisnis Anda — baik untuk ',
    originP2End:
      'pembuatan website baru, custom web application, PWA, maupun pengembangan SaaS — kita bisa mendiskusikannya dan mewujudkannya bersama.',
    originP3:
      'Tanpa birokrasi agensi yang berbelit-belit atau klaim berlebihan: Anda berdiskusi dan bekerja langsung dengan developer yang merancang logika dan membangun kode dari baris pertama.',
    principlesHeading: 'Tiga Prinsip Kerja',
    principle1Title: '1. Membangun Proyek Nyata & Fungsional',
    principle1Desc:
      'Mengutamakan sistem kerja yang menyelesaikan masalah nyata dengan performa tinggi, bukan sekadar mock-up visual tanpa logika database.',
    principle2Title: '2. Menguji di Kondisi Nyata',
    principle2Desc:
      'Mengoptimalkan aplikasi untuk kondisi sebenarnya: responsive di layar HP kecil (320px), load time instan, dan skenario offline-first.',
    principle3Title: '3. Komunikasi Transparan & Langsung',
    principle3Desc:
      'Mencatat keputusan arsitektur, trade-off teknis, dan estimasi waktu pengerjaan secara jujur dan transparan kepada klien dan mitra.',
    servicesHeading: 'Layanan & Kerja Sama yang Tersedia',
    servicesDesc:
      'Punya ide produk digital, butuh sistem kasir/operasional khusus, atau ingin membangun website performa tinggi untuk bisnis Anda? Beberapa hal yang siap saya kerjakan:',
    servicesList: [
      'Custom Web Application & Dashboard',
      'PWA & Offline-First POS System',
      'High-Performance Showcase & Portfolio',
      'Fullstack MVP & SaaS Prototype',
      'Landing Page',
      'Company Profile',
    ],
    connectHeading: 'Mari Terhubung & Mulai Proyek Anda',
    connectDesc:
      'Jika Anda tertarik membangun sesuatu bersama, ingin membeli/menyesuaikan sistem dari Labs, atau sekadar ingin berkonsultasi mengenai teknis arsitektur:',
    chatWa: 'Chat WhatsApp (Diskusi Proyek)',
    sendEmail: 'Kirim Email',
    github: 'GitHub',
  },
  privacy: {
    badge: 'Privasi & Data',
    title: 'Kebijakan Privasi',
    intro:
      'Tinkerbench Labs menghormati hak privasi setiap pengunjung. Komitmen kami sederhana dan transparan.',
    sec1Title: '1. Tidak Ada Pelacakan Pribadi (No Tracking)',
    sec1Desc:
      'Situs ini tidak memasang cookie pelacak lintas situs (third-party tracking cookies), pixel iklan, atau script sidik jari perangkat (fingerprinting).',
    sec2Title: '2. Tidak Ada Akun Pengunjung atau Penyimpanan Pesan',
    sec2Desc:
      'Kami tidak mewajibkan pendaftaran akun untuk membaca artikel atau melihat demo proyek. Tautan komunikasi langsung seperti WhatsApp atau email hanya menghubungkan Anda ke aplikasi resmi masing-masing tanpa menyimpan riwayat pesan ke dalam basis data situs ini.',
    sec3Title: '3. Hosting & Log Server',
    sec3Desc:
      'Website di-host menggunakan platform Vercel dan Supabase. Log server standar (alamat IP dan user agent) diproses oleh penyedia hosting hanya untuk tujuan stabilitas jaringan, pencegahan serangan DDoS, dan pemeliharaan performa.',
  },
  projectDetail: {
    breadcrumbLabs: 'Labs',
    notFound: 'Proyek Tidak Ditemukan',
    publishedOn: 'Terbit:',
    tryDemo: 'Coba Demo Langsung',
    demoUnavailable: 'Demo publik belum dibuka untuk tingkat',
    sourceCode: 'Source Code',
    chatWa: 'Tertarik? Chat WA',
    askCustomize: 'Tanya Penyesuaian',
    sendFeedback: 'Kirim Masukan',
    problemSolved: 'Masalah yang Diselesaikan',
    techDetails: 'Detail & Pendekatan Teknis',
    keyFeatures: 'Fitur Utama',
    techStack: 'Tech Stack & Tools',
    currentLimitations: 'Batasan & Ruang Lingkup Saat Ini',
    buildLog: 'Build Log',
    relatedNotes: 'Catatan Terkait Proyek Ini',
  },
  noteDetail: {
    breadcrumbNotes: 'Notes',
    notFound: 'Catatan Tidak Ditemukan',
    minRead: 'menit baca',
    updatedOn: 'Diperbarui:',
    relatedProject: 'Terkait dengan proyek:',
    openLab: 'Buka Lab →',
    otherNotes: 'Catatan Lain dari Proyek yang Sama',
  },
};
