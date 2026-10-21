-- Migration: 20261021000000_init_schema.sql
-- PRD Tinkerbench Labs v1.2: Schema, Constraints, Functions, RLS & Storage

-- 1. Helper function for updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Table: projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  problem text,
  content text,
  features jsonb not null default '[]'::jsonb,
  limitations text,
  tech_stack text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  maturity text not null check (maturity in ('concept', 'production', 'prototype', 'demo', 'beta')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  project_type text not null check (project_type in ('web_app', 'pwa', 'saas', 'ecommerce', 'landing_page', 'portfolio', 'customizable', 'saas_candidate')),
  cover_path text,
  cover_alt text,
  gallery jsonb not null default '[]'::jsonb,
  build_log jsonb not null default '[]'::jsonb,
  demo_url text check (demo_url is null or demo_url ~* '^https://'),
  source_url text check (source_url is null or source_url ~* '^https://'),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_project_cover_alt check (cover_path is null or (cover_alt is not null and length(trim(cover_alt)) > 0)),
  constraint check_project_features_array check (jsonb_typeof(features) = 'array'),
  constraint check_project_gallery_array check (jsonb_typeof(gallery) = 'array'),
  constraint check_project_build_log_array check (jsonb_typeof(build_log) = 'array')
);

-- Trigger updated_at on projects
drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.handle_updated_at();

-- 3. Table: posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  tags text[] not null default '{}'::text[],
  cover_path text,
  cover_alt text,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_post_cover_alt check (cover_path is null or (cover_alt is not null and length(trim(cover_alt)) > 0))
);

-- Trigger updated_at on posts
drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.handle_updated_at();

-- 4. Table: post_projects (many-to-many relationship)
create table if not exists public.post_projects (
  post_id uuid not null references public.posts(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  primary key (post_id, project_id)
);

-- 5. Table: admins
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 6. Indexes
create index if not exists idx_projects_publication on public.projects(publication_status, published_at desc);
create index if not exists idx_posts_publication on public.posts(publication_status, published_at desc);
create index if not exists idx_post_projects_project_id on public.post_projects(project_id);
create index if not exists idx_projects_tags on public.projects using gin(tags);
create index if not exists idx_posts_tags on public.posts using gin(tags);

-- 7. Security Definer Function: is_admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
     and exists (
       select 1
       from public.admins
       where user_id = (select auth.uid())
     );
$$;

-- Secure is_admin permissions
alter function public.is_admin() owner to postgres;
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- 8. Enable Row Level Security (RLS) on all public tables
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.post_projects enable row level security;
alter table public.admins enable row level security;

-- 9. RLS Policies: projects
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects"
  on public.projects for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "admin read all projects" on public.projects;
create policy "admin read all projects"
  on public.projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 10. RLS Policies: posts
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "admin read all posts" on public.posts;
create policy "admin read all posts"
  on public.posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts"
  on public.posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 11. RLS Policies: post_projects
drop policy if exists "public read post_projects" on public.post_projects;
create policy "public read post_projects"
  on public.post_projects for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_projects.post_id and p.publication_status = 'published'
    )
    and exists (
      select 1 from public.projects pr
      where pr.id = post_projects.project_id and pr.publication_status = 'published'
    )
  );

drop policy if exists "admin write post_projects" on public.post_projects;
create policy "admin write post_projects"
  on public.post_projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Note: No select/write policies on public.admins for anon/authenticated,
-- managed strictly through SQL editor or internal administrative scripts.

-- 12. Storage Bucket setup & policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "admin insert media bucket" on storage.objects;
create policy "admin insert media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media bucket" on storage.objects;
create policy "admin update media bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media bucket" on storage.objects;
create policy "admin delete media bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

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

-- 10. Insert Post 1: Build Log & Technical Decision
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
