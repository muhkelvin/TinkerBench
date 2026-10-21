-- Seed data: Realistic development projects as outlined in PRD Section 19

-- 1. Insert Project 1: NexaPOS
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
  'NexaPOS — Modern Cloud Point of Sale',
  'nexapos',
  'Sistem kasir berbasis cloud yang cepat, responsif di tablet, dan mendukung transaksi offline-first untuk toko retail kecil.',
  'Banyak aplikasi kasir modern terlalu berat untuk perangkat entry-level atau lambat saat koneksi internet terputus di tengah antrean pembayaran.',
  '## Pendekatan Teknis

NexaPOS dirancang dengan prinsip **offline-first queue**. Setiap transaksi disimpan secara lokal di IndexedDB terlebih dahulu, lalu di-sync ke server saat koneksi stabil.

### Arsitektur Sinkronisasi
- Transaksi lokal diberi UUID dan timestamp monotonic.
- Worker background mencoba flush queue setiap 10 detik.
- Konflik stok diselesaikan dengan aturan last-write-wins pada level item katalog.',
  '["Transaksi offline-first dengan sinkronisasi background", "Manajemen inventori multi-kategori dan varian produk", "Penerbitan struk digital via thermal print dan tautan web", "Laporan ringkasan penjualan harian"]'::jsonb,
  'Integrasi printer Bluetooth masih memerlukan web bluetooth API yang hanya aktif di Chromium mobile.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'PostgreSQL'],
  array['pos', 'offline-first', 'retail', 'web-app'],
  'concept',
  'published',
  'pwa',
  '/images/projects/nexapos.jpg',
  'Mockup Antarmuka NexaPOS Point of Sale Tablet',
  '[]'::jsonb,
  '[
    {"date": "2026-10-15", "text": "Implementasi IndexedDB transaction queue dan offline fallback"},
    {"date": "2026-10-18", "text": "Perbaikan rendering katalog grid pada resolusi layar tablet"}
  ]'::jsonb,
  null,
  'https://github.com/example/nexapos',
  true,
  now() - interval '3 days'
) on conflict (slug) do nothing;

-- 2. Insert Project 2: E-commerce Analytics Dashboard
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
  'E-commerce Analytics & Cohort Explorer',
  'ecommerce-analytics',
  'Dashboard analitik performa penjualan, retensi pelanggan, dan analisis cohort berbasis data transaksi e-commerce.',
  'Pemilik brand sering kesulitan melihat tren repeat-order dan churn rate karena data tersebar di berbagai platform tanpa visualisasi kohort yang jelas.',
  '## Eksplorasi Data & Matriks

Fokus proyek ini adalah agregasi data transaksi secara modular. Metrik retensi dihitung per minggu pendaftaran pengguna untuk memvisualisasikan degradasi engagement seiring waktu.',
  '["Visualisasi matriks cohort retention bulanan", "Grafik tren GMV, AOV, dan order frequency", "Filter segmentasi pelanggan loyal vs one-time buyer", "Ekspor ringkasan laporan ke CSV"]'::jsonb,
  'Data demo menggunakan data transaksi sintetis teranonimisasi.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  array['analytics', 'dashboard', 'ecommerce', 'metrics', 'saas'],
  'production',
  'published',
  'saas',
  '/images/projects/ecommerce-analytics.jpg',
  'Dashboard Visualisasi Cohort Analytics E-commerce',
  '[]'::jsonb,
  '[
    {"date": "2026-10-10", "text": "Pembuatan kalkulasi matriks cohort retention di SQL view"},
    {"date": "2026-10-12", "text": "Optimasi rendering tabel heatmap untuk layar mobile"}
  ]'::jsonb,
  'https://demo-analytics.example.com',
  'https://github.com/example/ecommerce-analytics',
  true,
  now() - interval '7 days'
) on conflict (slug) do nothing;

-- 3. Insert Project 3: Lumina Studio Photography
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
  '44444444-4444-4444-4444-444444444444',
  'Lumina Studio — Commercial Photography & Booking',
  'lumina-photography',
  'Website showcase portofolio visual fotografi komersial studio dengan integrasi booking jadwal otomatis dan reservasi sesi.',
  'Studio foto sering kehilangan calon klien karena portofolio di media sosial tidak terstruktur dan alur booking konsultasi jadwal masih manual lewat chat yang lambat.',
  '## Pendekatan Desain & Teknis

Website ini dibangun dengan arsitektur visual-first berfokus pada kecepatan load aset foto resolusi tinggi menggunakan Next.js Image optimization dan WebP formatting.

### Alur Booking Terintegrasi
- Kalender interaktif pemilihan tanggal dan paket sesi foto.
- Form inquiry terhubung langsung ke WhatsApp API studio dengan prefilled summary.
- Galeri dinamis berbasis tag kategori (Commercial, Editorial, Portrait).',
  '["Galeri visual interaktif dengan kategori filter cepat", "Sistem booking tanggal dan paket sesi foto", "Integrasi direct chat WhatsApp dengan ringkasan pesanan otomatis", "Desain tipografi editorial premium responsif"]'::jsonb,
  'Integrasi pembayaran otomatis via payment gateway masih dalam tahap evaluasi biaya per transaksi.',
  array['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase'],
  array['photography', 'booking', 'portfolio', 'landing-page'],
  'production',
  'published',
  'landing_page',
  '/images/projects/lumina-photography.jpg',
  'Tampilan Website Lumina Photography Studio',
  '[]'::jsonb,
  '[
    {"date": "2026-10-19", "text": "Desain layout editorial gallery dan integrasi lazy loading foto"},
    {"date": "2026-10-21", "text": "Implementasi alur booking konsultasi via direct WhatsApp link"}
  ]'::jsonb,
  'https://lumina-studio.example.com',
  'https://github.com/example/lumina-photography',
  true,
  now() - interval '1 days'
) on conflict (slug) do nothing;

-- 4. Insert Post 1: Build Log & Technical Decision
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

-- 5. Associate Post with Project
insert into public.post_projects (post_id, project_id)
values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111'
) on conflict do nothing;
