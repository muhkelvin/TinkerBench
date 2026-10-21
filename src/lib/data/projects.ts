import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import { escapeIlikePattern } from '@/lib/utils';

// Fallback seed projects for offline / preview environment
const FALLBACK_PROJECTS: Project[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'PhotoGPay — Photo Selection Tool for Photographers',
    slug: 'photogpay',
    summary:
      'Alat kurasi dan seleksi foto klien untuk fotografer terintegrasi Google Drive. Klien memilih foto favorit tanpa login, dan fotografer menyalin seluruh nama file dalam 1-klik untuk Lightroom.',
    problem:
      'Klien fotografi sering mengirim puluhan tangkapan layar (screenshot) berantakan lewat WhatsApp atau menyebutkan nomor urut foto secara manual, menyebabkan fotografer membuang waktu berjam-jam mencocokkan file satu per satu dan rentan salah edit foto.',
    content: `## Solusi Kurasi Foto Klien

PhotoGPay dirancang khusus untuk memotong friksi komunikasi antara fotografer dan klien setelah sesi photoshoot selesai.

### Alur Kerja 4 Langkah (Zero Friction)
1. **Google Drive Integration**: Fotografer mengunggah hasil foto JPG ke folder Google Drive seperti biasa.
2. **Instant Web Gallery**: Menghubungkan URL folder Google Drive ke PhotoGPay dalam 1-klik untuk menghasilkan tautan galeri web responsif.
3. **Client Pick without Login**: Klien membuka tautan galeri langsung di peramban HP atau laptop tanpa repot membuat akun.
4. **1-Click Copy Filename**: Klien mengetuk foto yang disukai dan menekan tombol *Salin Nama Foto*. Fotografer cukup melakukan Ctrl + V di kolom pencarian Lightroom atau Finder.`,
    features: [
      'Integrasi galeri foto instan dari folder Google Drive',
      '1-Click Copy seluruh daftar nama file yang dipilih ke clipboard',
      'Akses galeri klien bebas login dan tanpa instalasi aplikasi',
      'Kompatibel langsung dengan pencarian batch di Adobe Lightroom & macOS Finder',
    ],
    limitations:
      'Ukuran file preview awal bergantung pada resolusi JPG yang disinkronisasikan dari Google Drive.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Google Drive API', 'Supabase'],
    tags: ['photography', 'workflow', 'saas', 'google-drive', 'tool'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'saas',
    cover_path: '/images/projects/photogpay.png',
    cover_alt: 'Antarmuka PhotoGPay - Photo Selection Tool for Photographers',
    gallery: [],
    build_log: [
      { date: '2026-10-14', text: 'Integrasi Google Drive picker API dan rendering thumbnail dinamis' },
      { date: '2026-10-18', text: 'Optimasi fungsi clipboard multi-platform dan visualisasi 1-click copy' },
    ],
    demo_url: 'https://photo-g-pay.vercel.app/',
    source_url: 'https://github.com/muhkelvin/photogpay',
    is_featured: true,
    published_at: '2026-10-21T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-21T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'StockFlow — Inventory & Order Management System',
    slug: 'stockflow',
    summary:
      'Satu sumber kebenaran (single source of truth) untuk mutasi stok, pesanan supplier, dan siklus penjualan toko berbasis buku besar gudang dengan konsistensi atomik.',
    problem:
      'Pencatatan inventaris UMKM dan distributor yang masih mengandalkan spreadsheet rentan terhadap selisih stok, hilangnya audit trail saat terjadi revisi, serta overselling saat pesanan datang simultan.',
    content: `## Arsitektur Buku Besar Gudang

StockFlow menggantikan pencatatan manual spreadsheet dengan sistem transaksi stok persediaan berbasis ledger atomik di PostgreSQL.

### Pilar Keandalan Sistem
- **Zero Negative Stock**: Validasi atomik di level database menjamin jumlah stok tidak pernah menjadi minus meskipun terdapat beberapa transaksi penjualan yang terjadi bersamaan.
- **Append-Only Ledger**: Setiap mutasi barang masuk, keluar, atau koreksi dicatat sebagai baris mutasi baru. Koreksi dilakukan melalui jurnal pembalik (reversal) tanpa pernah menghapus rekaman historis.
- **Weighted Average Cost (WAC)**: Valuasi harga pokok persediaan (HPP) dihitung secara presisi menggunakan metode moving average setiap ada barang masuk baru.`,
    features: [
      'Pencatatan mutasi stok append-only ledger dengan audit trail lengkap',
      'Validasi transaksi atomik anti-stok minus (Zero Negative Stock)',
      'Perhitungan HPP otomatis dengan metode Weighted Average Cost',
      'Simulasi kasir & modul penjualan terintegrasi katalog produk',
      'Role-Based Access Control (RBAC) tegas antara Admin dan Staf Operasional',
    ],
    limitations:
      'Sinkronisasi barcode scanner hardware eksternal saat ini menggunakan standar keyboard wedge emulation.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Zod'],
    tags: ['inventory', 'order-management', 'postgresql', 'supabase', 'retail'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/stockflow.png',
    cover_alt: 'Antarmuka Sistem Manajemen Stok dan Pesanan Gudang StockFlow',
    gallery: [],
    build_log: [
      { date: '2026-10-12', text: 'Rancang skema tabel ledger mutasi stok dan trigger atomik PostgreSQL' },
      { date: '2026-10-16', text: 'Penyusunan modul kasir dan formulir pesanan supplier dengan validasi Zod' },
    ],
    demo_url: 'https://stock-invoentory-and-management.vercel.app/',
    source_url: 'https://github.com/muhkelvin/stockflow',
    is_featured: true,
    published_at: '2026-10-20T10:00:00Z',
    created_at: '2026-10-12T08:00:00Z',
    updated_at: '2026-10-20T10:00:00Z',
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'NexaPOS — Modern Retail Point of Sale',
    slug: 'nexapos',
    summary:
      'Sistem kasir retail berbasis web dengan estetika Kertas & Tinta (Paper & Ink), pemantauan omzet harian real-time, manajemen kategori produk, dan deteksi peringatan stok menipis.',
    problem:
      'Aplikasi kasir retail konvensional seringkali memiliki antarmuka yang membingungkan kasir pemula, lambat saat kalkulasi keranjang, dan tidak memberikan peringatan dini ketika stok barang di etalase toko habis.',
    content: `## Filosofi Desain Kertas & Tinta

NexaPOS dibangun dengan pendekatan desain bertema *Paper & Ink* yang bersih, kontras tinggi, dan ramah sentuhan (touch-friendly) untuk operasional kasir retail yang sibuk.

### Fitur Kunci Operasional
- **Dashboard Metrik Kasir**: Ringkasan omzet (total pendapatan), jumlah transaksi, unit terjual, average transaction value (ATV), dan estimasi laba kotor.
- **Peringatan Stok Rendah**: Deteksi otomatis item persediaan yang berada di bawah ambang batas minimum toko.
- **Multi-Metode Pembayaran**: Mendukung pencatatan transaksi Cash, QRIS, dan Transfer Bank.`,
    features: [
      'Antarmuka kasir cepat dengan tata letak Paper & Ink kontras tinggi',
      'Grafik omzet harian interaktif dan laporan kontribusi penjualan per kategori',
      'Peringatan visual instan untuk stok persediaan di bawah batas minimum',
      'Riwayat mutasi transaksi kasir terbaru dengan filter rentang waktu',
    ],
    limitations:
      'Pencetakan struk fisik saat ini menggunakan dialog print browser sistem.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'LocalStorage', 'PostgreSQL'],
    tags: ['pos', 'retail', 'dashboard', 'sales', 'offline-first'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/nexapos-dashboard.png',
    cover_alt: 'Dashboard Operasional Retail NexaPOS Point of Sale',
    gallery: [],
    build_log: [
      { date: '2026-10-15', text: 'Implementasi IndexedDB transaction queue dan offline fallback' },
      { date: '2026-10-18', text: 'Perbaikan rendering katalog grid pada resolusi layar tablet' },
    ],
    demo_url: 'https://pos-sable-chi.vercel.app/dashboard',
    source_url: 'https://github.com/muhkelvin/nexapos',
    is_featured: true,
    published_at: '2026-10-19T10:00:00Z',
    created_at: '2026-10-11T08:00:00Z',
    updated_at: '2026-10-19T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'HubFlow — CRM & Contact Management System',
    slug: 'hubflow',
    summary:
      'Platform CRM SaaS terpusat untuk pelacakan kontak klien, direktori perusahaan relasional, segmentasi tag dinamis, dan pemantauan prospek bisnis baru.',
    problem:
      'Tim bisnis sering kehilangan jejak calon klien potensial karena data kontak tersimpan di buku telepon pribadi, email terpisah, dan tidak adanya kategorisasi relasional terhadap perusahaan induk.',
    content: `## Manajemen Kontak Relasional Modern

HubFlow mempermudah pelacakan relasi bisnis melalui arsitektur relasional yang rapi antara kontak individu, perusahaan, dan taksonomi label kustom.

### Arsitektur Data & Fleksibilitas Penyimpanan
- **Junction Tables Relasional**: Menghubungkan setiap entitas kontak dengan multi-tag dan asosiasi perusahaan.
- **Dual Mode Storage**: Mendukung sinkronisasi langsung ke Supabase PostgreSQL serta mode Local Storage demo untuk evaluasi cepat tanpa konfigurasi database.
- **Optimasi Performa**: Dibangun dengan Next.js App Router dan Tailwind CSS v4 untuk transisi antarmuka yang sangat mulus.`,
    features: [
      'Manajemen kontak dan direktori perusahaan relasional',
      'Sistem pelabelan tag dinamis dengan junction table PostgreSQL',
      'Ringkasan kartu metrik kontak baru (7 hari terakhir), perusahaan, dan tag aktif',
      'Dukungan mode ganda: Live Supabase DB dan Local Storage Demo',
    ],
    limitations:
      'Pengiriman email outreach massal saat ini masih dialihkan via email client default sistem.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'Supabase', 'PostgreSQL'],
    tags: ['crm', 'contact-management', 'saas', 'supabase', 'tailwind-v4'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'saas',
    cover_path: '/images/projects/hubflow.png',
    cover_alt: 'Dashboard HubFlow CRM & Contact Management System',
    gallery: [],
    build_log: [
      { date: '2026-10-10', text: 'Implementasi schema PostgreSQL dengan relasi junction table untuk tags' },
      { date: '2026-10-14', text: 'Penyempurnaan transisi antarmuka light-theme Tailwind CSS v4' },
    ],
    demo_url: 'https://hub-flow-contact-management-system.vercel.app/',
    source_url: 'https://github.com/muhkelvin/hubflow',
    is_featured: true,
    published_at: '2026-10-18T10:00:00Z',
    created_at: '2026-10-10T08:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    title: 'Servis AC Prima Sejuk — Sistem Operasional & Dispatch Lapangan',
    slug: 'servis-ac-ops',
    summary:
      'Aplikasi manajemen internal servis dan pemeliharaan AC: sistem dispatch work order teknisi, papan jadwal penugasan harian, dan audit omzet operasional.',
    problem:
      'Jasa servis AC rumahan dan komersial sering mengalami tumpang-tindih jadwal teknisi, sparepart yang belum tersedia saat teknisi tiba di lokasi, serta pelaporan biaya jasa yang lambat diverifikasi admin.',
    content: `## Manajemen Tiket dan Dispatch Lapangan

Aplikasi internal ini menghubungkan alur kerja antara Admin Operasional, Teknisi Lapangan, dan Pemilik Bisnis dalam satu sistem kendali terintegrasi.

### Alur Operasional (Work Order Lifecycle)
1. **Penerimaan Tiket**: Admin menerima keluhan unit pendingin dan membuat Work Order baru (Inspection / Repair / Maintenance).
2. **Penjadwalan & Dispatch**: Menugaskan teknisi sesuai ketersediaan slot jam kerja pada papan jadwal harian.
3. **Tracking Sparepart**: Memantau pekerjaan yang berstatus 'Menunggu Sparepart' untuk mempercepat pengadaan unit.
4. **Review & Audit Omzet**: Teknisi mengunggah bukti pengerjaan, admin menyetujui laporan akhir, dan omzet terverifikasi langsung tercatat di pembukuan.`,
    features: [
      'Pusat kendali antrean tindakan dispatch dan persetujuan review teknisi',
      'Papan timeline jadwal kerja teknisi lapangan harian',
      'Database riwayat perawatan pelanggan, lokasi pemasangan, dan kapasitas PK unit AC',
      'Simulasi akun peran (Owner, Admin Ops, Teknisi Lapangan)',
    ],
    limitations:
      'Pelacakan lokasi teknisi real-time menggunakan update checkpoint status penugasan.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase'],
    tags: ['field-service', 'operations', 'dispatch', 'management', 'internal-tool'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/servis-ac-ops.png',
    cover_alt: 'Pusat Operasional Dispatch Servis AC Prima Sejuk',
    gallery: [],
    build_log: [
      { date: '2026-10-13', text: 'Pembangunan modul switch simulasi role akun dan layout responsive dispatch' },
      { date: '2026-10-17', text: 'Pengembangan antrean review bukti foto perbaikan unit teknisi' },
    ],
    demo_url: 'https://jasa-ac-sukp.vercel.app/',
    source_url: 'https://github.com/muhkelvin/servis-ac-ops',
    is_featured: true,
    published_at: '2026-10-17T10:00:00Z',
    created_at: '2026-10-09T08:00:00Z',
    updated_at: '2026-10-17T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Nusantara Store — E-commerce Analytics & Executive Dashboard',
    slug: 'ecommerce-analytics',
    summary:
      'Executive SaaS analytics dashboard untuk toko daring di Indonesia. Visualisasi tren pendapatan harian, kecepatan order, kontribusi kategori, dan performa regional top 5 kota.',
    problem:
      'Pemilik bisnis daring di Indonesia kesulitan melihat tren performa penjualan dan preferensi metode pembayaran karena data transaksi tersebar di banyak channel tanpa visualisasi analitik yang komprehensif.',
    content: `## Analitik E-commerce Berbasis Data

Dashboard Nusantara Store dirancang untuk memberikan insight eksekutif terhadap kesehatan finansial dan operasional toko ritel online.

### Visualisasi & Metrik Utama
- **Revenue Trend & Velocity**: Grafik perbandingan net revenue harian terhadap periode sebelumnya serta volume transaksi per interval waktu.
- **Regional Sales Breakdown**: Analisis omzet per kota utama di Indonesia (Denpasar, Medan, Malang, Surabaya, Makassar).
- **Payment Method Distribution**: Pangsa metode pembayaran digital lokal (E-Wallet GoPay/OVO, Virtual Account, Cash on Delivery, dan QRIS Instant).
- **Pipeline Operasional**: Distribusi status pesanan dari Delivered, Shipped, Processing, Pending, hingga Cancelled.`,
    features: [
      'Visualisasi tren pendapatan dan order velocity interaktif dengan Recharts',
      'Breakdown kontribusi omzet regional kota-kota di Indonesia',
      'Analisis pangsa metode pembayaran lokal (QRIS, E-Wallet, VA, COD)',
      'Daftar produk terlaris (Top Selling Products) dengan metrik unit dan pendapatan',
    ],
    limitations: 'Data pada lingkungan demo menggunakan sampel data transaksi komersial sintetis.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Recharts', 'PostgreSQL'],
    tags: ['analytics', 'dashboard', 'ecommerce', 'recharts', 'data-viz'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'saas',
    cover_path: '/images/projects/ecommerce-analytics.jpg',
    cover_alt: 'Dashboard Analitik E-commerce Nusantara Store',
    gallery: [],
    build_log: [
      { date: '2026-10-10', text: 'Pembuatan kalkulasi matriks cohort retention di SQL view' },
      { date: '2026-10-12', text: 'Optimasi visualisasi grafik Recharts dan tabel breakdown kota' },
    ],
    demo_url: 'https://saas-dasboard.vercel.app/dashboard',
    source_url: 'https://github.com/muhkelvin/ecommerce-analytics',
    is_featured: true,
    published_at: '2026-10-16T10:00:00Z',
    created_at: '2026-10-08T08:00:00Z',
    updated_at: '2026-10-16T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    title: "Maison L'Aura — Haute Parfumerie & Curated Scents",
    slug: 'maison-laura-parfumerie',
    summary:
      'Boutique luxury e-commerce untuk parfum artisan batch kecil dengan estetika editorial Playfair, kurasi olfactory family (The Woods, Garden of Memories, Chronicles of Amber), dan keranjang belanja dinamis.',
    problem:
      'Website e-commerce produk wewangian seringkali terasa generik dan gagal menonjolkan nilai seni piramida aroma, keunikan botol hand-poured, serta pengalaman belanja yang intim dan eksklusif.',
    content: `## Pengalaman Belanja Wewangian Mewah

Maison L'Aura memadukan filosofi slow perfumery dengan antarmuka digital yang mewah dan tenang.

### Eksplorasi Sensori & Fitur Belanja
- **Olfactory Chapters**: Koleksi disusun berdasarkan keluarga aroma (Woody, Floral, Amber, Citrus) yang mempermudah pelanggan menemukan wewangian yang selaras dengan kepribadian mereka.
- **Bespoke Product Pages**: Informasi piramida aroma mendalam (top notes, heart notes, base notes), ukuran botol, dan rekomendasi layer aroma.
- **Keranjang Belanja Real-Time**: Interaksi add-to-bag instan dengan drawer keranjang dan kalkulasi nilai pesanan.`,
    features: [
      'Desain tipografi editorial mewah dengan Playfair Display & nuansa warna cream/gold',
      'Kurasi katalog berbasis olfactory families dan wewangian signature',
      'Koleksi produk artisan dengan opsi pemilihan ukuran botol (Select Size)',
      'Keranjang belanja (Shopping Bag) interaktif dengan alur checkout',
    ],
    limitations:
      'Sistem langganan sample discovery box bulanan direncanakan pada rilis versi 2.0.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Playfair Display', 'Cart State'],
    tags: ['ecommerce', 'luxury', 'perfume', 'store', 'landing-page'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'ecommerce',
    cover_path: '/images/projects/maison-laura.jpg',
    cover_alt: "Tampilan Boutique E-commerce Maison L'Aura Haute Parfumerie",
    gallery: [],
    build_log: [
      { date: '2026-10-09', text: 'Desain layout editorial luxury dengan font Playfair Display' },
      { date: '2026-10-15', text: 'Implementasi shopping bag drawer dan kalkulasi ongkir dinamis' },
    ],
    demo_url: 'https://parfume-store-e-commerce.vercel.app/',
    source_url: 'https://github.com/muhkelvin/maison-laura',
    is_featured: false,
    published_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-07T08:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    title: 'Community Forum — Discussion & Knowledge Hub',
    slug: 'community-forum',
    summary:
      'Platform forum diskusi komunitas teknologi modern dengan thread interaktif, guard identitas, kategorisasi topik terstruktur, dan pencarian cepat.',
    problem:
      'Diskusi teknis dan pertukaran pengetahuan antar anggota komunitas di media sosial seringkali cepat tenggelam dan sulit diakses kembali untuk referensi jangka panjang.',
    content: `## Ruang Kolaborasi dan Diskusi Terbuka

Community Forum menyediakan wadah terstruktur bagi para pegiat teknologi, desainer, dan kreator untuk berdiskusi, berbagi pengetahuan, dan memamerkan proyek.

### Fitur Platform
- **Kategori Topik Terstruktur**: Diskusi dikelompokkan dalam kategori jelas (Development, Design, Showcase, Resources) untuk memudahkan navigasi.
- **Thread & Reply Berantai**: Diskusi mendalam dengan antarmuka yang bersih dan bebas distraksi.
- **Pencarian Cepat & Filter**: Mempermudah penemuan artikel atau pertanyaan seputar topik tertentu.`,
    features: [
      'Katalog diskusi berantai berdasarkan kategori topik minat',
      'Sistem Identity Guard untuk autentikasi dan otorisasi kontributor',
      'Dukungan pencarian cepat artikel dan diskusi komunitas',
      'Notifikasi toast interaktif untuk interaksi komentar dan thread baru',
    ],
    limitations:
      'Integrasi markdown editor WYSIWYG tingkat lanjut sedang dalam pengembangan.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    tags: ['community', 'forum', 'discussion', 'social', 'supabase'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/community-forum.jpg',
    cover_alt: 'Antarmuka Community Forum - Where Ideas Come to Grow',
    gallery: [],
    build_log: [
      { date: '2026-10-11', text: 'Implementasi skema relasi forum threads, replies, dan user profile guard' },
      { date: '2026-10-16', text: 'Desain layout kategori interaktif dan toast feedback' },
    ],
    demo_url: 'https://community-chi-woad.vercel.app/',
    source_url: 'https://github.com/muhkelvin/community-forum',
    is_featured: false,
    published_at: '2026-10-14T10:00:00Z',
    created_at: '2026-10-06T08:00:00Z',
    updated_at: '2026-10-14T10:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    title: 'Publiqa — Modern Content & Publishing Platform',
    slug: 'publiqa-blog',
    summary:
      'Platform publikasi konten dan blog editorial mandiri dengan dashboard analitik publikasi, manajemen artikel, dan taksonomi kategori konten.',
    problem:
      'CMS blogging tradisional sering kali memuat dependensi yang berat, lambat dalam performa SEO Core Web Vitals, dan memiliki alur kerja penulisan yang rumit.',
    content: `## Platform Publikasi Konten Editorial

Publiqa dirancang untuk penulis dan penerbit yang menginginkan kecepatan, kesederhanaan, dan kontrol penuh atas konten artikel mereka.

### Dashboard & Manajemen Konten
- **Executive Publishing Metrics**: Memantau jumlah total artikel yang ditulis, jumlah kategori aktif, total tag taksonomi, dan produktivitas publikasi bulanan.
- **Manajemen Artikel Terpusat**: Pengelolaan status artikel dari draf hingga terbit dengan antarmuka yang bersih.
- **Arsitektur Cepat**: Memanfaatkan rendering statis Next.js untuk waktu muat halaman secepat kilat dan skor performa maksimal.`,
    features: [
      'Dashboard ringkasan metrik artikel, kategori, dan produktivitas bulanan',
      'Sistem manajemen artikel dan kategorisasi taksonomi konten',
      'Arsitektur performa tinggi berbasis Next.js App Router',
      'Antarmuka editorial minimalis ramah pembaca dan penulis',
    ],
    limitations:
      'Fitur multi-author editorial review workflow sedang dipersiapkan untuk versi berikutnya.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Markdown'],
    tags: ['blog', 'cms', 'publishing', 'content-platform', 'markdown'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/publiqa.svg',
    cover_alt: 'Dashboard Publikasi Konten Editorial Publiqa',
    gallery: [],
    build_log: [
      { date: '2026-10-10', text: 'Perancangan arsitektur editorial CMS berbasis markdown' },
      { date: '2026-10-14', text: 'Integrasi metrik publikasi bulanan dan kategorisasi tag' },
    ],
    demo_url: 'https://blog-rho-ochre-78.vercel.app/',
    source_url: 'https://github.com/muhkelvin/publiqa-blog',
    is_featured: false,
    published_at: '2026-10-13T10:00:00Z',
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-13T10:00:00Z',
  },
];

/**
 * Get featured projects for Homepage (max 3)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.slice(0, 3);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('publication_status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.slice(0, 3);
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS.slice(0, 3);
  }
}

/**
 * Get all published projects for Labs directory with optional filters
 */
export async function getPublishedProjects(options?: {
  search?: string;
  status?: string;
  type?: string;
  tag?: string;
}): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');

  const filterFallback = () => {
    let list = [...FALLBACK_PROJECTS];
    if (options?.status) {
      list = list.filter((p) => {
        if (options.status === 'concept') {
          return p.maturity === 'concept' || (p.maturity as string) === 'prototype';
        }
        if (options.status === 'production') {
          return (
            p.maturity === 'production' ||
            (p.maturity as string) === 'demo' ||
            (p.maturity as string) === 'beta'
          );
        }
        return p.maturity === options.status;
      });
    }
    if (options?.type) {
      list = list.filter((p) => {
        if (options.type === 'web_app') {
          return p.project_type === 'web_app' || p.project_type === 'portfolio' || p.project_type === 'customizable';
        }
        if (options.type === 'saas') {
          return p.project_type === 'saas' || p.project_type === 'saas_candidate';
        }
        return p.project_type === options.type;
      });
    }
    if (options?.tag) {
      const targetTag = options.tag.toLowerCase();
      list = list.filter(
        (p) => p.tags && p.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.summary.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return list;
  };

  if (!isSupabaseConfigured()) {
    return filterFallback();
  }

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('projects')
      .select('*')
      .eq('publication_status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (options?.status) {
      query = query.eq('maturity', options.status as import('@/types/database.types').Maturity);
    }
    if (options?.type) {
      query = query.eq('project_type', options.type as import('@/types/database.types').ProjectType);
    }
    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }
    if (options?.search) {
      const sanitized = escapeIlikePattern(options.search);
      query = query.or(`title.ilike.%${sanitized}%,summary.ilike.%${sanitized}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterFallback();
    }
    return data as Project[];
  } catch {
    return filterFallback();
  }
}

/**
 * Get published project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', `project:${slug}`);

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('publication_status', 'published')
      .single();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }
    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get all published project slugs for sitemap
 */
export async function getPublishedProjectSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('publication_status', 'published');

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
    }
    return data;
  } catch {
    return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }
}

// ---------------- Admin data queries (Uncached) ----------------

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS;
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) {
      return FALLBACK_PROJECTS;
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
    }
    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
  }
}

