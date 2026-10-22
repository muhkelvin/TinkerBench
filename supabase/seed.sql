-- Seed data: Realistic development projects as outlined in PRD Section 19

-- 1. Insert Project: PhotoGPay
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000001',
  'PhotoGPay — Photo Selection Tool for Photographers',
  'photogpay',
  'Alat kurasi dan seleksi foto klien untuk fotografer terintegrasi Google Drive. Klien memilih foto favorit tanpa login, dan fotografer menyalin seluruh nama file dalam 1-klik untuk Lightroom.',
  'Klien fotografi sering mengirim puluhan tangkapan layar (screenshot) berantakan lewat WhatsApp atau menyebutkan nomor urut foto secara manual, menyebabkan fotografer membuang waktu berjam-jam mencocokkan file satu per satu dan rentan salah edit foto.',
  '## Solusi Kurasi Foto Klien

PhotoGPay dirancang khusus untuk memotong friksi komunikasi antara fotografer dan klien setelah sesi photoshoot selesai.

### Alur Kerja 4 Langkah (Zero Friction)
1. **Google Drive Integration**: Fotografer mengunggah hasil foto JPG ke folder Google Drive seperti biasa.
2. **Instant Web Gallery**: Menghubungkan URL folder Google Drive ke PhotoGPay dalam 1-klik untuk menghasilkan tautan galeri web responsif.
3. **Client Pick without Login**: Klien membuka tautan galeri langsung di peramban HP atau laptop tanpa repot membuat akun.
4. **1-Click Copy Filename**: Klien mengetuk foto yang disukai dan menekan tombol *Salin Nama Foto*. Fotografer cukup melakukan Ctrl + V di kolom pencarian Lightroom atau Finder.',
  '["Integrasi galeri foto instan dari folder Google Drive", "1-Click Copy seluruh daftar nama file yang dipilih ke clipboard", "Akses galeri klien bebas login dan tanpa instalasi aplikasi", "Kompatibel langsung dengan pencarian batch di Adobe Lightroom & macOS Finder"]'::jsonb,
  'Ukuran file preview awal bergantung pada resolusi JPG yang disinkronisasikan dari Google Drive.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Google Drive API', 'Supabase'],
  array['photography', 'workflow', 'saas', 'google-drive', 'tool'],
  'production',
  'published',
  'saas',
  '/images/projects/photogpay.png',
  'Antarmuka PhotoGPay - Photo Selection Tool for Photographers',
  '[]'::jsonb,
  '[
    {"date": "2026-10-14", "text": "Integrasi Google Drive picker API dan rendering thumbnail dinamis"},
    {"date": "2026-10-18", "text": "Optimasi fungsi clipboard multi-platform dan visualisasi 1-click copy"}
  ]'::jsonb,
  'https://photo-g-pay.vercel.app/',
  'https://github.com/muhkelvin/photogpay',
  true,
  now() - interval '1 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 2. Insert Project: StockFlow
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000002',
  'StockFlow — Inventory & Order Management System',
  'stockflow',
  'Satu sumber kebenaran (single source of truth) untuk mutasi stok, pesanan supplier, dan siklus penjualan toko berbasis buku besar gudang dengan konsistensi atomik.',
  'Pencatatan inventaris UMKM dan distributor yang masih mengandalkan spreadsheet rentan terhadap selisih stok, hilangnya audit trail saat terjadi revisi, serta overselling saat pesanan datang simultan.',
  '## Arsitektur Buku Besar Gudang

StockFlow menggantikan pencatatan manual spreadsheet dengan sistem transaksi stok persediaan berbasis ledger atomik di PostgreSQL.

### Pilar Keandalan Sistem
- **Zero Negative Stock**: Validasi atomik di level database menjamin jumlah stok tidak pernah menjadi minus meskipun terdapat beberapa transaksi penjualan yang terjadi bersamaan.
- **Append-Only Ledger**: Setiap mutasi barang masuk, keluar, atau koreksi dicatat sebagai baris mutasi baru. Koreksi dilakukan melalui jurnal pembalik (reversal) tanpa pernah menghapus rekaman historis.
- **Weighted Average Cost (WAC)**: Valuasi harga pokok persediaan (HPP) dihitung secara presisi menggunakan metode moving average setiap ada barang masuk baru.',
  '["Pencatatan mutasi stok append-only ledger dengan audit trail lengkap", "Validasi transaksi atomik anti-stok minus (Zero Negative Stock)", "Perhitungan HPP otomatis dengan metode Weighted Average Cost", "Simulasi kasir & modul penjualan terintegrasi katalog produk", "Role-Based Access Control (RBAC) tegas antara Admin dan Staf Operasional"]'::jsonb,
  'Sinkronisasi barcode scanner hardware eksternal saat ini menggunakan standar keyboard wedge emulation.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Zod'],
  array['inventory', 'order-management', 'postgresql', 'supabase', 'retail'],
  'production',
  'published',
  'web_app',
  '/images/projects/stockflow.png',
  'Antarmuka Sistem Manajemen Stok dan Pesanan Gudang StockFlow',
  '[]'::jsonb,
  '[
    {"date": "2026-10-12", "text": "Rancang skema tabel ledger mutasi stok dan trigger atomik PostgreSQL"},
    {"date": "2026-10-16", "text": "Penyusunan modul kasir dan formulir pesanan supplier dengan validasi Zod"}
  ]'::jsonb,
  'https://stock-invoentory-and-management.vercel.app/',
  'https://github.com/muhkelvin/stockflow',
  true,
  now() - interval '2 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 3. Insert Project: NexaPOS
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '11111111-1111-1111-1111-111111111111',
  'NexaPOS — Modern Retail Point of Sale',
  'nexapos',
  'Sistem kasir retail berbasis web dengan estetika Kertas & Tinta (Paper & Ink), pemantauan omzet harian real-time, manajemen kategori produk, dan deteksi peringatan stok menipis.',
  'Aplikasi kasir retail konvensional seringkali memiliki antarmuka yang membingungkan kasir pemula, lambat saat kalkulasi keranjang, dan tidak memberikan peringatan dini ketika stok barang di etalase toko habis.',
  '## Filosofi Desain Kertas & Tinta

NexaPOS dibangun dengan pendekatan desain bertema *Paper & Ink* yang bersih, kontras tinggi, dan ramah sentuhan (touch-friendly) untuk operasional kasir retail yang sibuk.

### Fitur Kunci Operasional
- **Dashboard Metrik Kasir**: Ringkasan omzet (total pendapatan), jumlah transaksi, unit terjual, average transaction value (ATV), dan estimasi laba kotor.
- **Peringatan Stok Rendah**: Deteksi otomatis item persediaan yang berada di bawah ambang batas minimum toko.
- **Multi-Metode Pembayaran**: Mendukung pencatatan transaksi Cash, QRIS, dan Transfer Bank.',
  '["Antarmuka kasir cepat dengan tata letak Paper & Ink kontras tinggi", "Grafik omzet harian interaktif dan laporan kontribusi penjualan per kategori", "Peringatan visual instan untuk stok persediaan di bawah batas minimum", "Riwayat mutasi transaksi kasir terbaru dengan filter rentang waktu"]'::jsonb,
  'Pencetakan struk fisik saat ini menggunakan dialog print browser sistem.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'LocalStorage', 'PostgreSQL'],
  array['pos', 'retail', 'dashboard', 'sales', 'offline-first'],
  'production',
  'published',
  'web_app',
  '/images/projects/nexapos-dashboard.png',
  'Dashboard Operasional Retail NexaPOS Point of Sale',
  '[]'::jsonb,
  '[
    {"date": "2026-10-15", "text": "Implementasi IndexedDB transaction queue dan offline fallback"},
    {"date": "2026-10-18", "text": "Perbaikan rendering katalog grid pada resolusi layar tablet"}
  ]'::jsonb,
  'https://pos-sable-chi.vercel.app/dashboard',
  'https://github.com/muhkelvin/nexapos',
  true,
  now() - interval '3 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 4. Insert Project: HubFlow
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000004',
  'HubFlow — CRM & Contact Management System',
  'hubflow',
  'Platform CRM SaaS terpusat untuk pelacakan kontak klien, direktori perusahaan relasional, segmentasi tag dinamis, dan pemantauan prospek bisnis baru.',
  'Tim bisnis sering kehilangan jejak calon klien potensial karena data kontak tersimpan di buku telepon pribadi, email terpisah, dan tidak adanya kategorisasi relasional terhadap perusahaan induk.',
  '## Manajemen Kontak Relasional Modern

HubFlow mempermudah pelacakan relasi bisnis melalui arsitektur relasional yang rapi antara kontak individu, perusahaan, dan taksonomi label kustom.

### Arsitektur Data & Fleksibilitas Penyimpanan
- **Junction Tables Relasional**: Menghubungkan setiap entitas kontak dengan multi-tag dan asosiasi perusahaan.
- **Dual Mode Storage**: Mendukung sinkronisasi langsung ke Supabase PostgreSQL serta mode Local Storage demo untuk evaluasi cepat tanpa konfigurasi database.
- **Optimasi Performa**: Dibangun dengan Next.js App Router dan Tailwind CSS v4 untuk transisi antarmuka yang sangat mulus.',
  '["Manajemen kontak dan direktori perusahaan relasional", "Sistem pelabelan tag dinamis dengan junction table PostgreSQL", "Ringkasan kartu metrik kontak baru (7 hari terakhir), perusahaan, dan tag aktif", "Dukungan mode ganda: Live Supabase DB dan Local Storage Demo"]'::jsonb,
  'Pengiriman email outreach massal saat ini masih dialihkan via email client default sistem.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'Supabase', 'PostgreSQL'],
  array['crm', 'contact-management', 'saas', 'supabase', 'tailwind-v4'],
  'production',
  'published',
  'saas',
  '/images/projects/hubflow.png',
  'Dashboard HubFlow CRM & Contact Management System',
  '[]'::jsonb,
  '[
    {"date": "2026-10-10", "text": "Implementasi schema PostgreSQL dengan relasi junction table untuk tags"},
    {"date": "2026-10-14", "text": "Penyempurnaan transisi antarmuka light-theme Tailwind CSS v4"}
  ]'::jsonb,
  'https://hub-flow-contact-management-system.vercel.app/',
  'https://github.com/muhkelvin/hubflow',
  true,
  now() - interval '4 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 5. Insert Project: Servis AC Prima Sejuk
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000005',
  'Servis AC Prima Sejuk — Sistem Operasional & Dispatch Lapangan',
  'servis-ac-ops',
  'Aplikasi manajemen internal servis dan pemeliharaan AC: sistem dispatch work order teknisi, papan jadwal penugasan harian, dan audit omzet operasional.',
  'Jasa servis AC rumahan dan komersial sering mengalami tumpang-tindih jadwal teknisi, sparepart yang belum tersedia saat teknisi tiba di lokasi, serta pelaporan biaya jasa yang lambat diverifikasi admin.',
  '## Manajemen Tiket dan Dispatch Lapangan

Aplikasi internal ini menghubungkan alur kerja antara Admin Operasional, Teknisi Lapangan, dan Pemilik Bisnis dalam satu sistem kendali terintegrasi.

### Alur Operasional (Work Order Lifecycle)
1. **Penerimaan Tiket**: Admin menerima keluhan unit pendingin dan membuat Work Order baru (Inspection / Repair / Maintenance).
2. **Penjadwalan & Dispatch**: Menugaskan teknisi sesuai ketersediaan slot jam kerja pada papan jadwal harian.
3. **Tracking Sparepart**: Memantau pekerjaan yang berstatus ''Menunggu Sparepart'' untuk mempercepat pengadaan unit.
4. **Review & Audit Omzet**: Teknisi mengunggah bukti pengerjaan, admin menyetujui laporan akhir, dan omzet terverifikasi langsung tercatat di pembukuan.',
  '["Pusat kendali antrean tindakan dispatch dan persetujuan review teknisi", "Papan timeline jadwal kerja teknisi lapangan harian", "Database riwayat perawatan pelanggan, lokasi pemasangan, dan kapasitas PK unit AC", "Simulasi akun peran (Owner, Admin Ops, Teknisi Lapangan)"]'::jsonb,
  'Pelacakan lokasi teknisi real-time menggunakan update checkpoint status penugasan.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase'],
  array['field-service', 'operations', 'dispatch', 'management', 'internal-tool'],
  'production',
  'published',
  'web_app',
  '/images/projects/servis-ac-ops.png',
  'Pusat Operasional Dispatch Servis AC Prima Sejuk',
  '[]'::jsonb,
  '[
    {"date": "2026-10-13", "text": "Pembangunan modul switch simulasi role akun dan layout responsive dispatch"},
    {"date": "2026-10-17", "text": "Pengembangan antrean review bukti foto perbaikan unit teknisi"}
  ]'::jsonb,
  'https://jasa-ac-sukp.vercel.app/',
  'https://github.com/muhkelvin/servis-ac-ops',
  true,
  now() - interval '5 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 6. Insert Project: Nusantara Store (E-commerce Analytics)
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '22222222-2222-2222-2222-222222222222',
  'Nusantara Store — E-commerce Analytics & Executive Dashboard',
  'ecommerce-analytics',
  'Executive SaaS analytics dashboard untuk toko daring di Indonesia. Visualisasi tren pendapatan harian, kecepatan order, kontribusi kategori, dan performa regional top 5 kota.',
  'Pemilik bisnis daring di Indonesia kesulitan melihat tren performa penjualan dan preferensi metode pembayaran karena data transaksi tersebar di banyak channel tanpa visualisasi analitik yang komprehensif.',
  '## Analitik E-commerce Berbasis Data

Dashboard Nusantara Store dirancang untuk memberikan insight eksekutif terhadap kesehatan finansial dan operasional toko ritel online.

### Visualisasi & Metrik Utama
- **Revenue Trend & Velocity**: Grafik perbandingan net revenue harian terhadap periode sebelumnya serta volume transaksi per interval waktu.
- **Regional Sales Breakdown**: Analisis omzet per kota utama di Indonesia (Denpasar, Medan, Malang, Surabaya, Makassar).
- **Payment Method Distribution**: Pangsa metode pembayaran digital lokal (E-Wallet GoPay/OVO, Virtual Account, Cash on Delivery, dan QRIS Instant).
- **Pipeline Operasional**: Distribusi status pesanan dari Delivered, Shipped, Processing, Pending, hingga Cancelled.',
  '["Visualisasi tren pendapatan dan order velocity interaktif dengan Recharts", "Breakdown kontribusi omzet regional kota-kota di Indonesia", "Analisis pangsa metode pembayaran lokal (QRIS, E-Wallet, VA, COD)", "Daftar produk terlaris (Top Selling Products) dengan metrik unit dan pendapatan"]'::jsonb,
  'Data pada lingkungan demo menggunakan sampel data transaksi komersial sintetis.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Recharts', 'PostgreSQL'],
  array['analytics', 'dashboard', 'ecommerce', 'recharts', 'data-viz'],
  'production',
  'published',
  'saas',
  '/images/projects/ecommerce-analytics.jpg',
  'Dashboard Analitik E-commerce Nusantara Store',
  '[]'::jsonb,
  '[
    {"date": "2026-10-10", "text": "Pembuatan kalkulasi matriks cohort retention di SQL view"},
    {"date": "2026-10-12", "text": "Optimasi visualisasi grafik Recharts dan tabel breakdown kota"}
  ]'::jsonb,
  'https://saas-dasboard.vercel.app/dashboard',
  'https://github.com/muhkelvin/ecommerce-analytics',
  true,
  now() - interval '6 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 7. Insert Project: Maison L''Aura
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000007',
  'Maison L''Aura — Haute Parfumerie & Curated Scents',
  'maison-laura-parfumerie',
  'Boutique luxury e-commerce untuk parfum artisan batch kecil dengan estetika editorial Playfair, kurasi olfactory family (The Woods, Garden of Memories, Chronicles of Amber), dan keranjang belanja dinamis.',
  'Website e-commerce produk wewangian seringkali terasa generik dan gagal menonjolkan nilai seni piramida aroma, keunikan botol hand-poured, serta pengalaman belanja yang intim dan eksklusif.',
  '## Pengalaman Belanja Wewangian Mewah

Maison L''Aura memadukan filosofi slow perfumery dengan antarmuka digital yang mewah dan tenang.

### Eksplorasi Sensori & Fitur Belanja
- **Olfactory Chapters**: Koleksi disusun berdasarkan keluarga aroma (Woody, Floral, Amber, Citrus) yang mempermudah pelanggan menemukan wewangian yang selaras dengan kepribadian mereka.
- **Bespoke Product Pages**: Informasi piramida aroma mendalam (top notes, heart notes, base notes), ukuran botol, dan rekomendasi layer aroma.
- **Keranjang Belanja Real-Time**: Interaksi add-to-bag instan dengan drawer keranjang dan kalkulasi nilai pesanan.',
  '["Desain tipografi editorial mewah dengan Playfair Display & nuansa warna cream/gold", "Kurasi katalog berbasis olfactory families dan wewangian signature", "Koleksi produk artisan dengan opsi pemilihan ukuran botol (Select Size)", "Keranjang belanja (Shopping Bag) interaktif dengan alur checkout"]'::jsonb,
  'Sistem langganan sample discovery box bulanan direncanakan pada rilis versi 2.0.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Playfair Display', 'Cart State'],
  array['ecommerce', 'luxury', 'perfume', 'store', 'landing-page'],
  'production',
  'published',
  'ecommerce',
  '/images/projects/maison-laura.jpg',
  'Tampilan Boutique E-commerce Maison L''Aura Haute Parfumerie',
  '[]'::jsonb,
  '[
    {"date": "2026-10-09", "text": "Desain layout editorial luxury dengan font Playfair Display"},
    {"date": "2026-10-15", "text": "Implementasi shopping bag drawer dan kalkulasi ongkir dinamis"}
  ]'::jsonb,
  'https://parfume-store-e-commerce.vercel.app/',
  'https://github.com/muhkelvin/maison-laura',
  false,
  now() - interval '7 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 8. Insert Project: Community Forum
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000008',
  'Community Forum — Discussion & Knowledge Hub',
  'community-forum',
  'Platform forum diskusi komunitas teknologi modern dengan thread interaktif, guard identitas, kategorisasi topik terstruktur, dan pencarian cepat.',
  'Diskusi teknis dan pertukaran pengetahuan antar anggota komunitas di media sosial seringkali cepat tenggelam dan sulit diakses kembali untuk referensi jangka panjang.',
  '## Ruang Kolaborasi dan Diskusi Terbuka

Community Forum menyediakan wadah terstruktur bagi para pegiat teknologi, desainer, dan kreator untuk berdiskusi, berbagi pengetahuan, dan memamerkan proyek.

### Fitur Platform
- **Kategori Topik Terstruktur**: Diskusi dikelompokkan dalam kategori jelas (Development, Design, Showcase, Resources) untuk memudahkan navigasi.
- **Thread & Reply Berantai**: Diskusi mendalam dengan antarmuka yang bersih dan bebas distraksi.
- **Pencarian Cepat & Filter**: Mempermudah penemuan artikel atau pertanyaan seputar topik tertentu.',
  '["Katalog diskusi berantai berdasarkan kategori topik minat", "Sistem Identity Guard untuk autentikasi dan otorisasi kontributor", "Dukungan pencarian cepat artikel dan diskusi komunitas", "Notifikasi toast interaktif untuk interaksi komentar dan thread baru"]'::jsonb,
  'Integrasi markdown editor WYSIWYG tingkat lanjut sedang dalam pengembangan.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
  array['community', 'forum', 'discussion', 'social', 'supabase'],
  'production',
  'published',
  'web_app',
  '/images/projects/community-forum.jpg',
  'Antarmuka Community Forum - Where Ideas Come to Grow',
  '[]'::jsonb,
  '[
    {"date": "2026-10-11", "text": "Implementasi skema relasi forum threads, replies, dan user profile guard"},
    {"date": "2026-10-16", "text": "Desain layout kategori interaktif dan toast feedback"}
  ]'::jsonb,
  'https://community-chi-woad.vercel.app/',
  'https://github.com/muhkelvin/community-forum',
  false,
  now() - interval '8 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 9. Insert Project: Publiqa
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000009',
  'Publiqa — Modern Content & Publishing Platform',
  'publiqa-blog',
  'Platform publikasi konten dan blog editorial mandiri dengan dashboard analitik publikasi, manajemen artikel, dan taksonomi kategori konten.',
  'CMS blogging tradisional sering kali memuat dependensi yang berat, lambat dalam performa SEO Core Web Vitals, dan memiliki alur kerja penulisan yang rumit.',
  '## Platform Publikasi Konten Editorial

Publiqa dirancang untuk penulis dan penerbit yang menginginkan kecepatan, kesederhanaan, dan kontrol penuh atas konten artikel mereka.

### Dashboard & Manajemen Konten
- **Executive Publishing Metrics**: Memantau jumlah total artikel yang ditulis, jumlah kategori aktif, total tag taksonomi, dan produktivitas publikasi bulanan.
- **Manajemen Artikel Terpusat**: Pengelolaan status artikel dari draf hingga terbit dengan antarmuka yang bersih.
- **Arsitektur Cepat**: Memanfaatkan rendering statis Next.js untuk waktu muat halaman secepat kilat dan skor performa maksimal.',
  '["Dashboard ringkasan metrik artikel, kategori, dan produktivitas bulanan", "Sistem manajemen artikel dan kategorisasi taksonomi konten", "Arsitektur performa tinggi berbasis Next.js App Router", "Antarmuka editorial minimalis ramah pembaca dan penulis"]'::jsonb,
  'Fitur multi-author editorial review workflow sedang dipersiapkan untuk versi berikutnya.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Markdown'],
  array['blog', 'cms', 'publishing', 'content-platform', 'markdown'],
  'production',
  'published',
  'web_app',
  '/images/projects/publiqa.svg',
  'Dashboard Publikasi Konten Editorial Publiqa',
  '[]'::jsonb,
  '[
    {"date": "2026-10-10", "text": "Perancangan arsitektur editorial CMS berbasis markdown"},
    {"date": "2026-10-14", "text": "Integrasi metrik publikasi bulanan dan kategorisasi tag"}
  ]'::jsonb,
  'https://blog-rho-ochre-78.vercel.app/',
  'https://github.com/muhkelvin/publiqa-blog',
  false,
  now() - interval '9 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 10. Insert Project: BrandLab Launchpad
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000010',
  'BrandLab Launchpad — Curated High-Converting Landing Pages',
  'brandlab-launchpad',
  'Koleksi 6 landing page berkonversi tinggi dalam satu arsitektur terintegrasi. Dirancang secara presisi dengan identitas brand, tema warna, dan tipografi unik untuk beragam sektor bisnis.',
  'Banyak bisnis dan agensi kesulitan memproduksi landing page yang benar-benar berkonversi tinggi karena template generik seringkali mengabaikan hierarki visual, psikologi warna, dan identitas tipografi yang spesifik pada vertikal industri mereka.',
  '## Koleksi 6 Landing Page Spesifik Industri

BrandLab Launchpad menyajikan kurasi desain landing page performa tinggi yang memadukan estetika visual tajam dengan struktur tata letak berorientasi konversi.

### 6 Vertikal Bisnis yang Disertakan:
1. **Lumière (Skincare & Beauty)**: Desain mewah dengan font *Playfair Display* & *DM Sans*, nuansa warna gold champagne, dan narasi hasil nyata 14 hari.
2. **Brewly (Coffee Subscription)**: Visual warm earthy tone dengan font *Sora* & *Inter* untuk kurasi kopi nusantara langsung ke rumah.
3. **Wearbase (Korean Fashion)**: Estetika minimalis soft casual essentials dengan font *Outfit* & *Noto Sans KR*.
4. **Fitframe (Personal Training)**: Desain high-energy beraksen lime neon dengan font *Space Grotesk* & *Inter* untuk program coaching 1-on-1.
5. **Skillshift (Online Education)**: Antarmuka terstruktur dengan font *Plus Jakarta Sans* & *Inter* untuk kursus web development dan UI/UX design.
6. **Cozify (Candle & Lifestyle)**: Nuansa hangat dan intim dengan font *Cormorant Garamond* & *Jost* untuk koleksi aromaterapi rumah.

### Keunggulan Teknis
- **Satu Aplikasi Terpadu**: 6 landing page dibangun dalam satu repository Next.js App Router dengan pemisahan rute yang terstruktur rapi.
- **Micro-Interaction Dinamis**: Animasi transisi halus bertenaga Framer Motion meningkatkan engagement tanpa mengorbankan kecepatan muat.
- **Tipografi Terkurasi**: Integrasi Google Fonts yang disesuaikan secara khusus untuk memperkuat voice dan karakter tiap brand.',
  '["Koleksi 6 template landing page mandiri dengan identitas visual dan tipografi berbeda", "Animasi transisi halus dan scroll trigger interaktif dengan Framer Motion", "Arsitektur Next.js App Router yang ringan dengan Core Web Vitals optimal", "Komponen form CTA, price card, dan social proof yang diuji untuk konversi", "Responsif sempurna dari smartphone hingga monitor desktop layar lebar"]'::jsonb,
  'Koleksi ini siap dihubungkan ke backend database, payment gateway, maupun form marketing automation.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide React'],
  array['landing-page', 'showcase', 'conversion', 'ui-ux', 'framer-motion', 'tailwind-css'],
  'production',
  'published',
  'landing_page',
  '/images/projects/brandlab-launchpad.svg',
  'BrandLab Launchpad - Koleksi 6 Landing Page Berkonversi Tinggi',
  '[]'::jsonb,
  '[
    {"date": "2026-10-15", "text": "Perancangan sistem tema modular dan pemilihan 6 varian font unik"},
    {"date": "2026-10-19", "text": "Implementasi animasi transisi Framer Motion dan responsive preview grid"}
  ]'::jsonb,
  'https://landing-page-collection-indol.vercel.app/',
  'https://github.com/muhkelvin/landing-page-collection',
  true,
  now() - interval '10 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 11. Insert Project: LUXSHOOT
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000011',
  'LUXSHOOT — High-End Product Photography & Visuals',
  'luxshoot',
  'Website profil studio fotografi produk komersial premium dengan showcase visual 360°, retouching tingkat lanjut, dan estetika luxury modern untuk meningkatkan konversi brand.',
  'Banyak brand ritel dan e-commerce kesulitan meningkatkan rasio konversi karena foto produk mereka tampak datar, pencahayaan kurang profesional, dan tidak memiliki representasi visual interaktif yang membangun kepercayaan konsumen.',
  '## Studio Visual Produk Komersial & Retouching

LUXSHOOT adalah studio fotografi komersial yang berfokus pada produk bernilai tinggi (jam tangan mewah, kosmetik, aksesoris kulit, dan perhiasan).

### Layanan Utama
- **Precision & Clarity**: Setup tata cahaya sinematik untuk menonjolkan setiap detail dan tekstur material produk.
- **High-End Retouching**: Penyesuaian presisi warna akurat, eliminasi debu mikro, dan penyempurnaan pantulan cahaya.
- **360° Interactive Experience**: Pengalaman rotasi produk 360 derajat interaktif langsung di peramban web.

### Portofolio & Kolaborasi
Telah dipercaya oleh merek industri global seperti AURA, LUMINA, VANGUARD, ELEVATE, dan NOVA dengan karya unggulan meliputi Chronograph Masterpiece, Velvet Elegance, Artisan Leather, dan Diamond Collection.',
  '["Showcase galeri produk beresolusi tinggi dengan interaksi dinamis", "Bagian pengenalan layanan: Precision & Clarity, High-End Retouching, 360° Interactive", "Social proof mitra brand terkemuka (Aura, Lumina, Vanguard, Elevate, Nova)", "Integrasi tombol CTA instan: View Portfolio dan Explore Services"]'::jsonb,
  'Integrasi booking sesi pemotretan studio langsung terhubung via formulir kontak dan WhatsApp.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'photography', 'portfolio', 'commercial', 'luxury'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-12", "text": "Konsep tata letak editorial gelap dan tipografi luxury gold"},
    {"date": "2026-10-16", "text": "Implementasi grid showcase recent masterpieces dan responsive CTA"}
  ]'::jsonb,
  'https://cp-poto.vercel.app/',
  'https://github.com/muhkelvin/cp-poto',
  true,
  now() - interval '11 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 12. Insert Project: LuxeLiving
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000012',
  'LuxeLiving — Premium Real Estate & Modern Living',
  'luxeliving',
  'Website profil perusahaan properti dan real estate hunian mewah dengan katalog pencarian properti unggulan, metrik kredibilitas, dan layanan konsultasi terintegrasi.',
  'Calon pembeli properti kelas atas sering merasa ragu berinvestasi ketika situs agen real estate lambat, tidak transparan dalam menampilkan spesifikasi hunian, serta memiliki alur navigasi yang rumit.',
  '## Portofolio Real Estate & Hunian Eksklusif

LuxeLiving menghadirkan representasi digital berkelas untuk properti hunian mewah, villa modern, penthouse, dan townhouse di lokasi strategis.

### Fitur Kunci Platform
- **Pencarian Properti Interaktif**: Filter tipe properti, lokasi (Jakarta, Bali, Bandung), dan estimasi rentang harga.
- **Katalog Properti Unggulan**: Detail informasi kamar tidur, kamar mandi, luas tanah, dan harga (Grand Royale Residence PIK, Villa Modern Sanur, Penthouse Senopati).
- **Layanan Komprehensif**: Konsultasi Jual Properti, Beli Properti, Sewa Komersial, hingga Manajemen Aset.
- **Kredibilitas Teruji**: 15+ tahun pengalaman, 500+ properti terjual, 98% kepuasan klien, dan 25+ penghargaan desain.',
  '["Filter pencarian properti berdasarkan tipe, lokasi, dan harga", "Katalog kartu properti unggulan lengkap dengan spesifikasi kamar dan harga", "Statistik kredibilitas perusahaan dan ulasan kepuasan klien", "Bagian berita tren pasar properti dan artikel tips investasi", "Formulir booking konsultasi dan integrasi kontak WhatsApp"]'::jsonb,
  'Koneksi listing MLS properti eksternal dapat dihubungkan via API terintegrasi.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'real-estate', 'property', 'luxury', 'corporate'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-10", "text": "Rancang struktur layout katalog properti dan filter harga"},
    {"date": "2026-10-14", "text": "Penyusunan section layanan komprehensif dan review nasabah"}
  ]'::jsonb,
  'https://cp-estate.vercel.app/',
  'https://github.com/muhkelvin/cp-estate',
  true,
  now() - interval '12 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 13. Insert Project: StudioWed
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000013',
  'StudioWed — Editorial Wedding Photography Studio',
  'studiowed',
  'Website profil studio dokumentasi pernikahan editorial modern dengan tata letak visual elegan, paket layanan komprehensif, dan sistem penjadwalan konsultasi intim.',
  'Pasangan pengantin modern menginginkan gaya dokumentasi pernikahan yang timeless dan bercerita (storytelling), namun sering kesulitan menemukan fotografer dengan paket layanan yang transparan dan proses konsultasi yang rapi.',
  '## Dokumentasi Pernikahan Timeless & Otentik

StudioWed mengabadikan momen sakral pernikahan dengan pendekatan editorial fotografi modern dan penceritaan yang emosional.

### Penawaran Layanan (A Seamless Experience)
- **Full-Day Coverage**: Dokumentasi menyeluruh mulai dari sesi persiapan pagi hingga resepsi malam.
- **Digital Delivery**: Galeri online beresolusi tinggi dengan color grading premium.
- **Engagement Sessions**: Sesi pemotretan pre-wedding intim yang natural sebelum hari H.
- **Heirloom Albums**: Album fisik cetak eksklusif dengan material lay-flat archival berkualitas tinggi.

### Metrik Kinerja Studio
Telah mengabadikan 150+ pernikahan, 98 ulasan bintang lima, 12 publikasi majalah gaya hidup, dan 8 tahun rekam jejak industri fotografi.',
  '["Desain tipografi editorial monokrom modern dan bersih", "Kartu paket layanan: Full-Day Coverage, Digital Delivery, Engagement, Heirloom Albums", "Lencana ketersediaan booking real-time (Now booking for 2027)", "Metrik statistik jam terbang dan review bintang 5", "Alur CTA pemesanan konsultasi Book Consultation & Inquire Now"]'::jsonb,
  'Kapasitas pemotretan dibatasi per musim untuk menjamin kualitas kurasi karya seni.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'wedding', 'photography', 'editorial', 'portfolio'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-11", "text": "Desain antarmuka monokrom minimalis ramah fotografi editorial"},
    {"date": "2026-10-15", "text": "Pengembangan alur CTA konsultasi booking dan integrasi faq"}
  ]'::jsonb,
  'https://cp-wedding.vercel.app/',
  'https://github.com/muhkelvin/cp-wedding',
  true,
  now() - interval '13 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 14. Insert Project: InsurePlus
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000014',
  'InsurePlus — Comprehensive Insurance Solutions',
  'insureplus',
  'Website profil perusahaan asuransi terpercaya dengan portal panduan klaim digital, katalog produk proteksi finansial, kalkulator penawaran, dan jaringan 400+ RS.',
  'Industri asuransi konvensional kerap dipersepsikan rumit dan penuh birokrasi, membuat nasabah enggan mendaftar atau kesulitan memahami manfaat proteksi dan alur klaim.',
  '## Perlindungan Pasti di Setiap Ketidakpastian

InsurePlus hadir sejak 2005 untuk memberikan solusi proteksi kesehatan, aset properti, dan kendaraan dengan dukungan teknologi klaim modern.

### Portofolio Proteksi
- **Asuransi Kesehatan**: Perlindungan komprehensif untuk biaya rawat inap dan keluarga dengan fasilitas cashless.
- **Asuransi Properti**: Proteksi maksimal aset hunian dan bisnis dari risiko kebakaran dan bencana.
- **Asuransi Kendaraan**: Jaminan perlindungan mobil dari kerusakan kecelakaan hingga kehilangan.

### Keunggulan Layanan
- **Klaim Digital 24 Jam**: Proses klaim cepat via portal dengan garansi SLA 3 hari kerja.
- **Jaringan RS Rekanan Luas**: Akses instan ke 400+ rumah sakit rekanan di seluruh Indonesia.
- **Dukungan Konsultan Ahli**: Didampingi perencana keuangan tersertifikasi dengan pengalaman 20+ tahun.',
  '["Struktur navigasi multi-halaman: Home, About Us, Products, Claims, Contact", "Katalog produk proteksi kesehatan, properti, dan kendaraan", "Daftar mitra strategis: Bank BCA, Siloam Hospitals, Astra, Pertamina, Garuda", "Bagian testimoni nasabah terverifikasi", "Formulir interaktif permintaan penawaran premi dan konsultasi WhatsApp"]'::jsonb,
  'Proses pengajuan polis resmi dialihkan melalui verifikasi KYC perencana keuangan.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'insurance', 'finance', 'corporate', 'protection'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-09", "text": "Penyusunan arsitektur halaman produk asuransi dan panduan klaim"},
    {"date": "2026-10-13", "text": "Pembuatan formulir konsultasi polis dan direktori RS rekanan"}
  ]'::jsonb,
  'https://cp-insu.vercel.app/contact',
  'https://github.com/muhkelvin/cp-insu',
  true,
  now() - interval '14 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 15. Insert Project: CP-Auto
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000015',
  'CP-Auto — Fleet Management & Automotive Operations',
  'cp-auto',
  'Website profil perusahaan teknologi manajemen armada kendaraan komersial dengan metrik keandalan sistem, showcase solusi operasional armada, dan booking demo.',
  'Manajemen armada logistik tradisional yang mengandalkan spreadsheet manual rentan terhadap keterlambatan jadwal servis, pembengkakan biaya bahan bakar, dan ketidakpastian pelacakan aset kendaraan di lapangan.',
  '## Sistem Operasi Cerdas untuk Armada Kendaraan Modern

CP-Auto menyediakan platform terpadu untuk menyederhanakan operasional armada transportasi, mulai dari pemeliharaan preventif hingga penagihan otomatis.

### Skala & Rekam Jejak
- **Didirikan 2021**: Tumbuh pesat menjadi mitra ribuan armada pengiriman lokal dan perusahaan logistik enterprise.
- **50M+ Miles Tracked**: Puluhan juta mil terlacak dengan akurasi telemetri tinggi.
- **99.9% Uptime SLA**: Infrastruktur komputasi tangguh yang siap mendukung operasional 24/7 tanpa henti.

### Solusi Platform
Menghubungkan manajer armada dengan data performa kendaraan real-time, manajemen konsumsi bahan bakar, kepatuhan keselamatan pengemudi, dan portal sales demo.',
  '["Navigasi multi-page profesional: Services, Vehicles, Pricing, About Us, Contact", "Hero metrik kredibilitas: 50M+ Miles Tracked dan 99.9% Uptime SLA", "Cerita visi misi perusahaan di halaman About Us", "Alur interaksi Call-to-Action: Contact Sales dan Book Demo", "Desain antarmuka bertema gelap futuristik dengan radial glow gradient"]'::jsonb,
  'Koneksi telematika OBD-II kendaraan terhubung ke server backend enterprise.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'automotive', 'fleet-management', 'saas', 'enterprise'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-08", "text": "Desain layout tech modern dengan dark aesthetic dan metric cards"},
    {"date": "2026-10-12", "text": "Pembuatan halaman story About Us dan form lead booking demo"}
  ]'::jsonb,
  'https://cp-auto.vercel.app/about',
  'https://github.com/muhkelvin/cp-auto',
  true,
  now() - interval '15 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 16. Insert Project: CP Law
insert into public.projects (
  id,
  title,
  slug,
  summary,
  problem,
  content,
  features,
  limitations,
  tech_stack,
  tags,
  maturity,
  publication_status,
  project_type,
  cover_path,
  cover_alt,
  gallery,
  build_log,
  demo_url,
  source_url,
  is_featured,
  published_at
) values (
  '10000000-0000-0000-0000-000000000016',
  'CP Law — Modern Corporate & Tech Legal Counsel',
  'cp-law',
  'Website profil firma hukum korporat dan teknologi dengan profil tim partner advokat, area praktik spesialis (M&A, IP, Ketenagakerjaan, Privasi Data), dan portal klien.',
  'Klien perusahaan rintisan dan korporat teknologi membutuhkan firma hukum yang tidak hanya menguasai regulasi hukum tradisional, tetapi juga memahami arsitektur software, kepemilikan kode IP, dan dinamika pendanaan modal ventura.',
  '## Penasihat Hukum Korporat Berdaya Teknologi

CP Law Group memadukan keahlian hukum kelas atas (BigLaw) dengan kelincahan startup untuk melindungi dan mengakselerasi pertumbuhan bisnis klien.

### Tim Advokat Unggulan (Our Partners)
- **Sarah Jenkins (Managing Partner)**: Mantan BigLaw partner spesialis M&A korporat dan pendanaan venture capital.
- **David Chen (Partner, IP & Tech)**: Advokat paten berlatar belakang software engineer yang melindungi aset inti teknologi klien.
- **Elena Rodriguez (Head of Operations)**: Memastikan eksekusi layanan firma berjalan presisi dan efisien layaknya startup modern.

### Area Praktik Utama
- **Corporate & M&A**: Struktur entitas bisnis, restrukturisasi, dan transaksi akuisisi.
- **Intellectual Property**: Perlindungan paten software, merek dagang, dan lisensi hak cipta.
- **Employment & Labor**: Kepatuhan ketenagakerjaan dan skema opsi saham karyawan (ESOP).
- **Data Privacy & Compliance**: Kepatuhan perlindungan data pribadi dan keamanan siber.',
  '["Navigasi terstruktur: Services, About Us, Team, dan Contact", "Direktori profil tim managing partner lengkap dengan biografi dan keahlian", "Katalog spesialisasi area praktik hukum korporat dan teknologi", "Integrasi Client Portal access dan tombol Book Consultation", "Desain typography serif elegan dengan layout saas-card modern"]'::jsonb,
  'Kerahasiaan dokumen perkara klien dikelola melalui portal tersertifikasi SOC 2.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
  array['company-profile', 'legal', 'law-firm', 'corporate', 'consulting'],
  'production',
  'published',
  'customizable',
  null,
  null,
  '[]'::jsonb,
  '[
    {"date": "2026-10-07", "text": "Perancangan direktori profil partner dan katalog layanan hukum"},
    {"date": "2026-10-11", "text": "Penyempurnaan kartu saas-card dan navigasi glass-header"}
  ]'::jsonb,
  'https://cp-law.vercel.app/team',
  'https://github.com/muhkelvin/cp-law',
  true,
  now() - interval '16 days'
) on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  problem = excluded.problem,
  content = excluded.content,
  features = excluded.features,
  limitations = excluded.limitations,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  demo_url = excluded.demo_url,
  is_featured = excluded.is_featured;

-- 17. Insert Post 1: Build Log & Technical Decision
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  publication_status,
  published_at
) values (
  '33333333-3333-3333-3333-333333333333',
  'Memilih IndexedDB vs SQLite WASM untuk Aplikasi Offline-First',
  'memilih-indexeddb-vs-sqlite-wasm',
  'Catatan evaluasi teknis penyimpanan lokal browser untuk NexaPOS: performa, ukuran bundle, dan kemudahan migrasi skema.',
  'Dalam merancang NexaPOS, salah satu keputusan paling krusial adalah memilih storage engine lokal di sisi browser.

## Mengapa Membutuhkan Storage Lokal?
Ketika kasir sedang melayani antrean ramai dan koneksi WiFi terputus, aplikasi tidak boleh freeze atau menolak input transaksi. Transaksi harus tetap tercatat secara instan ke media lokal dan kemudian disinkronisasikan.

### Evaluasi Opsi
1. **SQLite WASM**:
   - Kelebihan: Sintaks SQL standar, constraint database sangat ketat.
   - Kekurangan: Ukuran binary WASM cukup besar (~800KB), waktu inisialisasi awal lebih lambat di HP murah.
2. **IndexedDB murni / IDB wrapper**:
   - Kelebihan: Dukungan bawaan browser tanpa beban bundle tambahan, konsumsi memori rendah.
   - Kekurangan: API async berbasis key-value cursor yang lebih rumit jika memerlukan relasi kompleks.

### Keputusan
Untuk kebutuhan NexaPOS pada tahap prototype, IndexedDB dipilih karena prioritas utamanya adalah kecepatan startup di perangkat mobile dan minimnya payload awal.',
  array['architecture', 'offline-first', 'indexeddb', 'nexapos'],
  'published',
  now() - interval '2 days'
) on conflict (slug) do nothing;

-- 11. Associate Post with Project
insert into public.post_projects (post_id, project_id)
values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111'
) on conflict do nothing;
