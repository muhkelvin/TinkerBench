-- ==============================================================================
-- Tinkerbench Labs — Seed Data: 10 Technical & Process Notes
-- File: supabase/seednotes.sql
-- Description: 10 comprehensive engineering build logs, architectural decisions,
--              and process notes connected to Tinkerbench projects.
-- ==============================================================================

-- 1. Note: Memilih IndexedDB vs SQLite WASM untuk Aplikasi POS Offline-First
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-333333333333',
  'Memilih IndexedDB vs SQLite WASM untuk Aplikasi Offline-First',
  'memilih-indexeddb-vs-sqlite-wasm',
  'Catatan evaluasi teknis penyimpanan lokal browser untuk NexaPOS: performa startup, ukuran bundle, dan kemudahan migrasi skema transaksi kasir.',
  'Dalam merancang sistem kasir retail **NexaPOS**, salah satu keputusan paling krusial yang harus diambil di awal adalah memilih storage engine lokal di sisi peramban klien.

## Mengapa Membutuhkan Storage Lokal?
Ketika kasir sedang melayani antrean pelanggan yang ramai pada jam sibuk dan koneksi internet tiba-tiba terputus, aplikasi tidak boleh mengalami *freeze*, memunculkan pesan galat fatal, atau menolak input transaksi. Transaksi kasir harus tetap tercatat secara instan ke media lokal perangkat, mencetak struk, dan kemudian menyinkronkan data secara otomatis begitu koneksi internet pulih.

### Evaluasi Dua Opsi Utama

#### 1. SQLite WASM (Official / Absurd-SQL)
- **Kelebihan**: Sintaks SQL standar, constraint database sangat ketat (Foreign Key, Unique Check), serta kemudahan query relasional rumit.
- **Kekurangan**: Ukuran binary WebAssembly (WASM) cukup besar (~800KB hingga 1.2MB gzipped), waktu inisialisasi awal (*cold start*) terasa lambat pada perangkat smartphone low-end atau tablet Android kasir murah, serta kompleksitas integrasi SharedArrayBuffer dan header OPFS (Origin Private File System).

#### 2. IndexedDB Native (dengan Wrapper Ringan)
- **Kelebihan**: Dukungan bawaan peramban (*zero bundle overhead*), inisialisasi instan tanpa parsing binary WASM, konsumsi memori hemat, dan kompatibel langsung di semua mobile browser tanpa konfigurasi header Cross-Origin Isolation khusus.
- **Kekurangan**: API async berbasis *object store* dan *cursor* yang cenderung lebih berbelit-belit dibandingkan deklaratif SQL bila membutuhkan relasi multi-tabel yang kompleks.

### Arsitektur Antrean Transaksi (Offline Queue)
Kami menerapkan pola antrean transaksi (*mutation outbox*) sederhana menggunakan IndexedDB:

```typescript
interface OfflineTransaction {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: ''cash'' | ''qris'' | ''transfer'';
  createdAt: string;
  synced: boolean;
}

// Menyimpan mutasi transaksi kasir ke IndexedDB lokal
export async function queueLocalTransaction(tx: OfflineTransaction): Promise<void> {
  const db = await openNexaDB();
  await db.put(''transaction_queue'', tx);
  triggerBackgroundSync();
}
```

### Keputusan Akhir
Untuk kebutuhan NexaPOS pada tahap operasional retail harian, **IndexedDB** dipilih sebagai pemenang. Prioritas utama kami adalah kecepatan *instant startup* kasir di perangkat tablet entry-level dan minimnya payload download awal bagi pengguna.',
  array['architecture', 'offline-first', 'indexeddb', 'sqlite-wasm', 'nexapos'],
  null,
  null,
  'published',
  'Memilih IndexedDB vs SQLite WASM untuk Offline-First POS | Tinkerbench Notes',
  'Evaluasi teknis storage engine browser untuk NexaPOS: performa startup, bundle size, dan keandalan antrean transaksi kasir.',
  now() - interval '2 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 1 ke NexaPOS
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-333333333333'::uuid, '11111111-1111-1111-1111-111111111111'::uuid
where exists (select 1 from public.projects where id = '11111111-1111-1111-1111-111111111111')
on conflict do nothing;


-- 2. Note: Menjamin Zero Negative Stock dengan Append-Only Ledger di PostgreSQL
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000002',
  'Menjamin Zero Negative Stock dengan Append-Only Ledger di PostgreSQL',
  'menjamin-zero-negative-stock-append-only-ledger',
  'Mengapa mengupdate kolom stock = stock - qty adalah anti-pattern dalam sistem inventaris, dan bagaimana arsitektur double-entry mutasi mencegah overselling.',
  'Dalam membangun **StockFlow**, tantangan teknis terbesar adalah memastikan jumlah stok barang di gudang tidak pernah bernilai minus (*zero negative stock*), terutama saat beberapa kasir dan saluran penjualan memproses barang yang sama secara bersamaan.

## Masalah Klasik: In-Place Mutation Anti-Pattern
Banyak sistem inventaris pemula menggunakan kueri SQL mutasi langsung seperti berikut:

```sql
-- Kueri rentan race condition jika tidak dikunci dengan hati-hati
UPDATE products 
SET current_stock = current_stock - 5 
WHERE id = ''product-123'';
```

Kelemahan fatal pola ini:
1. **Kehilangan Jejak Audit (*Audit Trail*)**: Kita tidak tahu *siapa*, *mengapa*, dan *dari transaksi mana* angka stok tersebut berkurang.
2. **Koreksi Berbahaya**: Jika ada barang rusak atau pengembalian retur, pengeditan angka langsung rentan terhadap kesalahan manusia (*human error*).
3. **Race Condition**: Dua transaksi simultan dapat membaca saldo stok lama yang sama dan menyebabkan stok fisik menjadi minus.

## Solusi: Append-Only Stock Movements Ledger
Di StockFlow, tabel `products` tidak menyimpan angka stok sebagai kolom yang diubah-ubah bebas. Sebaliknya, setiap perubahan dicatat sebagai baris mutasi baru pada tabel `inventory_movements`:

```sql
CREATE TABLE public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id),
  movement_type text NOT NULL CHECK (movement_type IN (''in'', ''out'', ''adjustment'', ''reversal'')),
  quantity integer NOT NULL, -- nilai positif untuk masuk, negatif untuk keluar
  reference_type text NOT NULL, -- ''sale'', ''purchase_order'', ''stock_opname''
  reference_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### PostgreSQL Trigger & Concurrency Lock
Untuk memvalidasi bahwa stok tidak pernah menjadi minus sebelum transaksi di-*commit*, kami menggunakan fungsi trigger PostgreSQL yang mengunci baris produk dengan `SELECT ... FOR UPDATE`:

```sql
CREATE OR REPLACE FUNCTION public.validate_stock_availability()
RETURNS trigger AS $$
DECLARE
  current_balance integer;
BEGIN
  -- Mengunci baris produk untuk transaksi ini saja
  PERFORM 1 FROM public.products WHERE id = NEW.product_id FOR UPDATE;

  -- Menghitung total saldo stok saat ini
  SELECT COALESCE(SUM(quantity), 0) INTO current_balance
  FROM public.inventory_movements
  WHERE product_id = NEW.product_id;

  -- Evaluasi apakah mutasi baru akan menyebabkan saldo minus
  IF (current_balance + NEW.quantity) < 0 THEN
    RAISE EXCEPTION ''Stok tidak mencukupi untuk produk ID: %. Saldo tersedia: %, Permintaan: %'',
      NEW.product_id, current_balance, ABS(NEW.quantity);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Hasil & Keuntungan
Dengan arsitektur *append-only ledger* ini:
- Pembukuan inventaris selalu memiliki riwayat audit 100% transparan.
- Kesalahan input diselesaikan dengan jurnal pembalik (*reversal entry*), bukan menghapus data historis.
- Zero overselling terjamin di tingkat basis data bahkan pada *high-concurrency order spikes*.',
  array['database', 'postgresql', 'inventory', 'concurrency', 'stockflow'],
  null,
  null,
  'published',
  'Menjamin Zero Negative Stock dengan Append-Only Ledger | Tinkerbench Notes',
  'Arsitektur transaksi stok inventaris menggunakan append-only ledger dan trigger validation di PostgreSQL untuk StockFlow.',
  now() - interval '4 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 2 ke StockFlow
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000002'::uuid, '10000000-0000-0000-0000-000000000002'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000002')
on conflict do nothing;


-- 3. Note: Eksperimen Clipboard API & Google Drive Picker Tanpa Serverless Function
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000003',
  'Eksperimen Clipboard API & Google Drive Picker Tanpa Serverless Function',
  'eksperimen-clipboard-api-dan-google-drive-picker',
  'Menghilangkan friksi seleksi 2.000 foto klien fotografer dengan arsitektur zero-serverless, Google Drive Picker, dan modern Clipboard API.',
  'Setiap fotografer pernikahan atau acara komersial menghadapi siklus melelahkan yang sama: mengunggah 1.000–3.000 foto mentah ke Google Drive, membagikan tautan folder ke klien, dan kemudian menerima balasan berupa puluhan *screenshot* layar ponsel via WhatsApp.

Fotografer kemudian harus mengetikkan nama file satu per satu di Adobe Lightroom untuk memulai proses *grading*. **PhotoGPay** dibuat untuk memotong 100% friksi ini.

## Tantangan Desain: Zero Friction untuk Klien & Nol Biaya Server
Dua tujuan utama prototipe ini:
1. **Klien tidak boleh login**: Jika klien harus mendaftar akun atau mengingat kata sandi, rasio adopsi akan anjlok drastis.
2. **Tanpa hosting database berat**: Seluruh foto berukuran besar tetap berada di Google Drive milik fotografer.

### Mengintegrasikan Google Drive API di Sisi Klien
Aplikasi meminta izin baca folder Google Drive yang dibagikan secara publik. Peramban mengekstrak daftar nama file dan URL *thumbnail* beresolusi optimal secara langsung:

```typescript
// Membaca file gambar dari shared Google Drive Folder ID
export async function fetchDrivePhotos(folderId: string, apiKey: string) {
  const query = encodeURIComponent(`''${folderId}'' in parents and mimeType contains ''image/'' and trashed = false`);
  const endpoint = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=1000&key=${apiKey}`;
  
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(''Gagal mengambil galeri foto Google Drive'');
  const data = await res.json();
  return data.files;
}
```

### Magic Step: 1-Click Clipboard untuk Lightroom
Setelah klien mengetuk foto-foto favorit mereka, tombol *''Salin Daftar Foto''* akan menyalin seluruh nama file yang dipilih dalam format yang siap dimasukkan ke kolom pencarian Adobe Lightroom atau Finder:

```typescript
export async function copyFilenamesForLightroom(selectedFilenames: string[]): Promise<boolean> {
  // Format query pencarian batch Lightroom: DSC_0124|DSC_0155|DSC_0890
  const lightroomPattern = selectedFilenames.join('' '');
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(lightroomPattern);
      return true;
    } else {
      // Fallback untuk browser lawas / non-secure context
      const textArea = document.createElement(''textarea'');
      textArea.value = lightroomPattern;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand(''copy'');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error(''Gagal menyalin nama file:'', err);
    return false;
  }
}
```

### Pembelajaran
Solusi berbasis *client-side browser capabilities* (seperti modern Clipboard API dan direct Google Drive endpoints) mampu menyelesaikan masalah nyata profesional kreatif tanpa memerlukan infrastruktur server backend yang mahal.',
  array['frontend', 'web-api', 'clipboard', 'google-drive', 'photogpay'],
  null,
  null,
  'published',
  'Clipboard API & Google Drive Picker Zero-Serverless | Tinkerbench Notes',
  'Arsitektur kurasi foto klien PhotoGPay: integrasi Google Drive API client-side dan ekspor clipboard instan untuk Lightroom.',
  now() - interval '6 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 3 ke PhotoGPay
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000003'::uuid, '10000000-0000-0000-0000-000000000001'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000001')
on conflict do nothing;


-- 4. Note: Strategi Optimasi Recharts pada Dashboard E-Commerce Ribuan Titik
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000004',
  'Strategi Optimasi Recharts pada Dashboard E-Commerce Ribuan Titik',
  'strategi-optimasi-recharts-ribuan-titik',
  'Menghilangkan frame-drop rendering grafik SVG Recharts pada Nusantara Store melalui downsampling LTTB dan agregasi SQL view.',
  'Saat mengembangkan dasbor analitik eksekutif **Nusantara Store**, grafik tren omzet harian dan kecepatan pesanan (*order velocity*) mengalami penurunan performa drastis ketika rentang waktu diubah dari 7 hari ke 90 hari.

Halaman mulai terasa patah-patah (*stuttering*), *input latency* pada tooltip melonjak di atas 300ms, dan profil memori browser menunjukkan penggunaan RAM melonjak tinggi.

## Mengapa Recharts Menjadi Lambat?
Recharts dibangun di atas elemen SVG. Setiap titik data pada diagram garis (*line chart*) atau area menghasilkan simpul DOM SVG mandiri (`<circle>`, `<path>`, dan elemen teks sumbu).

Ketika merender 90 hari dengan interval per jam (~2.160 titik data untuk 3 metrik berbeda), peramban terpaksa mengelola lebih dari 8.000 elemen SVG aktif. Setiap kali kursor mouse bergerak di atas grafik, perhitungan *hit-testing* dan re-render tooltip memicu *layout thrashing*.

### Dua Langkah Perbaikan Utama

#### 1. Agregasi Temporal di Level Basis Data (SQL Bucketization)
Alih-alih mengirimkan ribuan baris data mentah ke peramban klien untuk kemudian dijumlahkan dengan `Array.reduce()`, kami memindahkan kalkulasi ke PostgreSQL View menggunakan `date_bin` atau `date_trunc`:

```sql
-- Agregasi penjualan per bucket waktu dinamis
CREATE OR REPLACE VIEW public.v_daily_sales_analytics AS
SELECT 
  date_trunc(''day'', created_at) AS date_bucket,
  COUNT(id) AS total_orders,
  SUM(total_amount) AS net_revenue,
  AVG(total_amount) AS avg_order_value
FROM public.orders
WHERE status = ''completed''
GROUP BY date_trunc(''day'', created_at)
ORDER BY date_bucket ASC;
```

#### 2. Downsampling Menggunakan Algoritma LTTB (Largest-Triangle-Three-Buckets)
Untuk visualisasi grafik *real-time* dengan frekuensi tinggi, kami menerapkan algoritma downsampling **LTTB** di sisi server sebelum data diumpankan ke komponen Recharts. Algoritma ini mempertahankan bentuk visual puncak dan lembah grafik tanpa membuang tren visual penting:

```typescript
// Mengurangi 2.000 titik menjadi 150 titik representatif tanpa merusak bentuk kurva
export function downsampleLTTB<T extends { x: number; y: number }>(data: T[], threshold: number): T[] {
  if (data.length <= threshold) return data;
  // Implementasi algoritma LTTB...
  // Menjaga titik ekstrem (min/max) tetap terlihat tajam oleh eksekutif
  return sampledPoints;
}
```

### Hasil Benchmark
- **Waktu Render Awal**: Turun dari 980ms menjadi 42ms.
- **Konsumsi Memori DOM**: Penurunan elemen SVG dari ~8.500 simpul menjadi < 350 simpul.
- **Interaksi Tooltip**: Stabil pada 60 FPS tanpa jeda.',
  array['performance', 'data-viz', 'recharts', 'react', 'ecommerce-analytics'],
  null,
  null,
  'published',
  'Optimasi Recharts untuk Data Besar E-Commerce | Tinkerbench Notes',
  'Teknik optimasi performa Recharts menggunakan downsampling LTTB dan PostgreSQL temporal view pada Nusantara Store.',
  now() - interval '8 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 4 ke Nusantara Store
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000004'::uuid, '22222222-2222-2222-2222-222222222222'::uuid
where exists (select 1 from public.projects where id = '22222222-2222-2222-2222-222222222222')
on conflict do nothing;


-- 5. Note: Pola Junction Table vs Array Column untuk Sistem Tagging Dinamis di Supabase
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000005',
  'Pola Junction Table vs Array Column untuk Sistem Tagging Dinamis di Supabase',
  'pola-junction-table-vs-array-column-tagging-supabase',
  'Perbandingan performa, integritas data, dan kemudahan kueri antara text[] GIN index vs relasi junction table pada HubFlow CRM.',
  'Saat merancang skema basis data kontak untuk **HubFlow CRM**, salah satu pertimbangan arsitektur yang sering diperdebatkan adalah: *Bagaimana cara menyimpan tag atau label kontak klien?*

Apakah cukup menggunakan kolom array PostgreSQL (`tags text[]`), atau sebaiknya membuat relasi many-to-many lengkap dengan tabel junction (`contacts`, `tags`, dan `contact_tags`)?

## Perbandingan Karakteristik

| Kriteria | Kolom Array (`text[]`) | Relasi Junction Table (`M:N`) |
| :--- | :--- | :--- |
| **Kemudahan Skema** | Sangat mudah (1 kolom saja) | Perlu 3 tabel (`contacts`, `tags`, `contact_tags`) |
| **Kueri Supabase JS** | `.contains(''tags'', [''vip''])` | `.select(''*, tags(*)'')` |
| **Integritas Referensial** | Tidak ada (raw string) | Ketat dengan Foreign Key & Cascade |
| **Mengubah Nama Tag** | Harus UPDATE seluruh baris teks | Cukup UPDATE 1 baris di tabel `tags` |
| **Statistik / Tag Cloud** | Perlu `unnest()` yang lebih mahal | Cukup `GROUP BY tag_id` dengan indeks B-Tree |

## Studi Kasus di HubFlow CRM
Di awal pengembangan HubFlow, kami sempat tergoda menggunakan kolom `tags text[]` karena kueri filternya tampak sederhana dengan indeks GIN:

```sql
-- Pendekatan Kolom Array
CREATE INDEX idx_contacts_tags ON public.contacts USING gin(tags);
SELECT * FROM public.contacts WHERE tags @> ARRAY[''enterprise'']::text[];
```

Namun masalah muncul ketika seorang admin CRM ingin mengubah label tag `''prospect''` menjadi `''lead-warm''`, atau menghapus label lama yang sudah tidak relevan. Pada basis data berisi 50.000 kontak, memperbarui teks di dalam ribuan array menghasilkan *table bloat* dan mengunci banyak baris transaksi.

### Arsitektur yang Kami Adopsi
Untuk HubFlow, kami beralih ke arsitektur **Junction Table relasional**:

```sql
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  color text NOT NULL DEFAULT ''#686960'',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_tags (
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (contact_id, tag_id)
);

CREATE INDEX idx_contact_tags_tag_id ON public.contact_tags(tag_id);
```

### Kesimpulan Praktis
- Gunakan **`text[]`** jika tag bersifat statis, deskriptif murni, dan tidak pernah memerlukan manajemen CRUD terpisah (seperti tag artikel blog di Tinkerbench).
- Gunakan **Junction Table** jika tag adalah entitas bisnis yang memiliki warna, hak akses, dapat diganti namanya secara global, atau memerlukan laporan analitik frekuensi penggunaan.',
  array['postgresql', 'supabase', 'crm', 'database-design', 'hubflow'],
  null,
  null,
  'published',
  'Junction Table vs Array Column Tagging PostgreSQL | Tinkerbench Notes',
  'Analisis mendalam pemilihan pola junction table vs array column berindeks GIN di PostgreSQL untuk sistem CRM HubFlow.',
  now() - interval '10 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 5 ke HubFlow
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000005'::uuid, '10000000-0000-0000-0000-000000000004'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000004')
on conflict do nothing;


-- 6. Note: Desain State Machine Tiket Dispatch Lapangan Tanpa Library Eksternal
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000006',
  'Desain State Machine Tiket Dispatch Lapangan Tanpa Library Eksternal',
  'desain-state-machine-tiket-dispatch-lapangan',
  'Mencegah fenomena status spaghetti pada operasional teknisi AC menggunakan deterministic state machine dan validasi transisi di Supabase.',
  'Pada aplikasi operasional lapangan seperti **Servis AC Prima Sejuk**, siklus hidup perintah kerja (*work order*) teknisi melibatkan banyak tahapan yang sensitif terhadap urutan.

Jika teknisi bisa langsung menandai tiket pekerjaan menjadi *''Selesai''* tanpa melalui status *''Sedang Dikerjakan''* atau tanpa mengunggah bukti foto unit, maka perhitungan upah harian dan audit omzet menjadi berantakan.

## Bahaya "Status Spaghetti"
Tanpa batasan transisi yang tegas, antarmuka frontend rentan melakukan kesalahan pengiriman status:
- Tiket yang dibatalkan tiba-tiba bisa diaktifkan kembali tanpa persetujuan Admin.
- Tiket yang sedang menunggu sparepart tiba-tiba ditutup sepihak.

### Menerapkan Finite State Machine (FSM) di TypeScript
Alih-alih menambahkan pustaka state machine pihak ketiga yang berukuran besar seperti XState, kami mendefinisikan tabel transisi deterministik murni menggunakan *object mapping* TypeScript:

```typescript
export type WorkOrderStatus = 
  | ''draft'' 
  | ''scheduled'' 
  | ''en_route'' 
  | ''in_progress'' 
  | ''waiting_parts'' 
  | ''review_pending'' 
  | ''completed'' 
  | ''cancelled'';

// Definisi legal transitions antar status kerja
export const VALID_STATUS_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  draft: [''scheduled'', ''cancelled''],
  scheduled: [''en_route'', ''cancelled''],
  en_route: [''in_progress'', ''scheduled''],
  in_progress: [''waiting_parts'', ''review_pending''],
  waiting_parts: [''in_progress'', ''cancelled''],
  review_pending: [''completed'', ''in_progress''], // Admin dapat menolak dan meminta revisi
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

export function canTransitionStatus(from: WorkOrderStatus, to: WorkOrderStatus): boolean {
  return VALID_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
```

### Validasi Lapis Ganda di PostgreSQL Trigger
Untuk menjamin keamanan bahwa klien atau API nakal tidak dapat membypass aturan status frontend, aturan yang sama diperkuat di basis data PostgreSQL:

```sql
CREATE OR REPLACE FUNCTION public.enforce_work_order_transition()
RETURNS trigger AS $$
BEGIN
  -- Izinkan jika status tidak berubah
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Validasi transisi terlarang: tidak boleh mengubah tiket yang sudah completed/cancelled
  IF OLD.status IN (''completed'', ''cancelled'') THEN
    RAISE EXCEPTION ''Tiket dengan status % bersifat final dan tidak dapat diubah kembali.'', OLD.status;
  END IF;

  -- Validasi transisi review_pending hanya boleh ke completed atau in_progress
  IF OLD.status = ''review_pending'' AND NEW.status NOT IN (''completed'', ''in_progress'') THEN
    RAISE EXCEPTION ''Tiket yang menunggu review hanya dapat disetujui (completed) atau dikembalikan (in_progress).'';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Keuntungan Praktis
Dengan pendekatan *lightweight deterministic state machine* ini, tim lapangan dan admin selalu berada pada frekuensi pemahaman yang sama, dan data omzet yang diverifikasi selalu memiliki keabsahan operasional 100%.',
  array['state-machine', 'workflow', 'typescript', 'architecture', 'servis-ac-ops'],
  null,
  null,
  'published',
  'Desain State Machine Tiket Dispatch Lapangan | Tinkerbench Notes',
  'Pola perancangan Finite State Machine tanpa library untuk alur kerja tiket dispatch lapangan pada Servis AC Prima Sejuk.',
  now() - interval '12 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 6 ke Servis AC Ops
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000006'::uuid, '10000000-0000-0000-0000-000000000005'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000005')
on conflict do nothing;


-- 7. Note: Mengelola Keranjang Belanja Tanpa Database Session untuk Brand E-Commerce
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000007',
  'Mengelola Keranjang Belanja Tanpa Database Session untuk Brand E-Commerce',
  'mengelola-cart-tanpa-database-session-ecommerce',
  'Arsitektur keranjang belanja berbasis Zustand & LocalStorage dengan server-side price validation saat checkout di Maison L''Aura.',
  'Saat membangun toko daring parfum mewah **Maison L''Aura**, kami menginginkan pengalaman navigasi belanja yang terasa sehalus aplikasi *native*. Pelanggan yang menambahkan botol parfum ke tas belanja tidak boleh menunggu *network request* berputar setiap kali mereka mengubah kuantitas.

Namun, menyimpan keranjang belanja di sisi klien tanpa pengelolaan yang hati-hati dapat menimbulkan celah keamanan manipulasi harga.

## Arsitektur: Client-First Cart State
Kami menggunakan **Zustand** dengan middleware *persist* ke `localStorage`. Pengguna dapat menambah, mengurangi, dan menghapus item secara instan:

```typescript
import { create } from ''zustand'';
import { persist } from ''zustand/middleware'';

export interface CartItem {
  productId: string;
  variantId: string; // misal: 50ml, 100ml
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existing = state.items.find(
          (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
        );
        if (existing) {
          return {
            items: state.items.map((i) =>
              i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
          };
        }
        return { items: [...state.items, newItem] };
      }),
      // ...implementasi fungsi lainnya
    }),
    { name: ''maison-laura-cart'' }
  )
);
```

### Jebakan Keamanan: Jangan Pernah Percayai Harga dari Klien
Satu kesalahan umum pada arsitektur keranjang lokal adalah mengirimkan objek `{ price: 1500000 }` dari browser langsung ke *payment gateway*. Pengguna dengan mudah dapat membuka DevTools dan mengubah nilai tersebut menjadi `Rp 1`.

### Solusi Server Action Snapshot Checkout
Saat tombol *Checkout* ditekan, browser hanya mengirimkan daftar ID dan kuantitas pesanan. Server Action Next.js bertanggung jawab penuh untuk mencocokkan harga resmi di basis data:

```typescript
''use server'';

export async function createCheckoutSession(clientItems: Array<{ productId: string; variantId: string; quantity: number }>) {
  // 1. Ambil harga resmi dari basis data untuk seluruh ID produk
  const productIds = clientItems.map((i) => i.productId);
  const officialProducts = await fetchProductsByIds(productIds);

  // 2. Kalkulasi ulang total harga di server
  let verifiedTotal = 0;
  for (const item of clientItems) {
    const matched = officialProducts.find((p) => p.id === item.productId);
    if (!matched) throw new Error(''Produk tidak valid atau sudah habis.'');
    verifiedTotal += matched.price * item.quantity;
  }

  // 3. Buat order terverifikasi di database
  const order = await insertOrder({ totalAmount: verifiedTotal, items: clientItems });
  return { orderId: order.id, paymentUrl: order.paymentUrl };
}
```

### Kesimpulan
Dengan memisahkan antara *UI State* lokal (responsif dan instan) dengan *Financial Computation* di server (aman dan terverifikasi), aplikasi e-commerce memperoleh kecepatan interaksi maksimal tanpa mengorbankan integritas transaksi bisnis.',
  array['ecommerce', 'zustand', 'state-management', 'security', 'maison-laura'],
  null,
  null,
  'published',
  'Manajemen Cart E-Commerce Tanpa Session DB | Tinkerbench Notes',
  'Pola arsitektur keranjang belanja Zustand client-first dan validasi server-side checkout pada Maison L''Aura.',
  now() - interval '14 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 7 ke Maison L'Aura
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000007'::uuid, '10000000-0000-0000-0000-000000000007'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000007')
on conflict do nothing;


-- 8. Note: Mengamankan Multi-Tenant Community Forum dengan Supabase Row-Level Security
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000008',
  'Mengamankan Multi-Tenant Community Forum dengan Supabase Row-Level Security',
  'mengamankan-forum-komunitas-supabase-rls',
  'Desain kebijakan RLS bebas celah untuk thread diskusi, moderasi komentar, dan pencegahan degradasi performa query pada Community Forum.',
  'Membangun **Community Forum** dengan Supabase memungkinkan pengembang mengandalkan PostgreSQL Row-Level Security (RLS) alih-alih menulis *guard clause* manual di setiap endpoint backend API.

Namun, menulis kebijakan RLS yang ceroboh dapat menyebabkan kebocoran data privat atau penurunan performa kueri secara eksponensial saat jumlah komentar membengkak.

## Tiga Aturan Keamanan Utama Forum
1. **Public Read**: Siapa pun dapat membaca thread diskusi dan balasan yang berstatus publik.
2. **Author Edit Only**: Hanya pembuat asli yang dapat memperbarui konten tulisan atau komentar miliknya sendiri.
3. **Admin/Moderator Override**: Admin dapat menyembunyikan atau menghapus konten yang melanggar aturan komunitas tanpa batas kepemilikan.

### Contoh Kebijakan RLS yang Dioptimalkan

```sql
-- 1. Aktifkan RLS pada tabel threads dan replies
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan Baca: Publik dapat membaca thread yang tidak di-archive
CREATE POLICY "Public threads are viewable by everyone"
ON public.threads FOR SELECT
USING (publication_status = ''published'');

-- 3. Kebijakan Tulis: Pengguna terautentikasi dapat membuat thread baru
CREATE POLICY "Authenticated users can create threads"
ON public.threads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- 4. Kebijakan Update: Hanya penulis atau Admin yang dapat memperbarui
CREATE POLICY "Authors and admins can update threads"
ON public.threads FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_id 
  OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = author_id 
  OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
```

### Menghindari Jebakan RLS Performance Leak
Kesalahan umum yang membuat aplikasi Supabase lambat adalah memanggil fungsi subquery yang berat di dalam klausa `USING` tanpa indeks foreign key.

Contoh perbaikan indeks penting:
```sql
-- Selalu berikan indeks pada kolom foreign key yang sering dievaluasi RLS
CREATE INDEX IF NOT EXISTS idx_threads_author_id ON public.threads(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON public.replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON public.replies(author_id);
```

Dengan indeks tersebut, PostgreSQL menggunakan Index Scan saat mengevaluasi kondisi `auth.uid() = author_id`, sehingga waktu eksekusi kueri tetap stabil di bawah 5 milidetik.',
  array['security', 'supabase', 'rls', 'postgresql', 'community-forum'],
  null,
  null,
  'published',
  'Mengamankan Forum Komunitas dengan Supabase RLS | Tinkerbench Notes',
  'Panduan perancangan kebijakan Row-Level Security (RLS) PostgreSQL berkinerja tinggi untuk Community Forum.',
  now() - interval '16 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 8 ke Community Forum
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000008'::uuid, '10000000-0000-0000-0000-000000000008'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000008')
on conflict do nothing;


-- 9. Note: Membangun Markdown Renderer Performa Tinggi dengan Zero Layout Shift
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000009',
  'Membangun Markdown Renderer Performa Tinggi dengan Zero Layout Shift',
  'membangun-markdown-renderer-zero-layout-shift',
  'Eksperimen arsitektur parsing konten Markdown di server Next.js untuk Publiqa: skor Core Web Vitals 100 dan tanpa pergeseran layout visual.',
  'Platform publikasi konten editorial **Publiqa** dirancang dengan satu prinsip mutlak: artikel harus tampil secepat kilat di peramban pembaca tanpa adanya pergeseran tata letak visual (*Cumulative Layout Shift* / CLS).

Sebagian besar CMS modern memuat library parser Markdown yang berat di sisi klien, menyebabkan font berkedip (*flash of unstyled text*) dan gambar melompat ketika selesai diunduh.

## Arsitektur Rendering: Server-Side AST Parsing
Alih-alih memproses string Markdown di browser menggunakan React state, seluruh proses transformasi Markdown ke HTML dilakukan di tingkat React Server Component (RSC):

```typescript
import { unified } from ''unified'';
import remarkParse from ''remark-parse'';
import remarkGfm from ''remark-gfm'';
import remarkRehype from ''remark-rehype'';
import rehypeSlug from ''rehype-slug'';
import rehypeAutolinkHeadings from ''rehype-autolink-headings'';
import rehypeStringify from ''rehype-stringify'';

export async function parseMarkdownToHtml(rawMarkdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: ''wrap'' })
    .use(rehypeStringify)
    .process(rawMarkdown);

  return String(file);
}
```

### Mengunci Zero Layout Shift pada Blok Kode & Media
Untuk menjamin CLS bernilai 0:
1. **Blok Kode (*Code Blocks*)**: Menggunakan styling CSS berbasis monospace dengan margin tetap dan scrolling horizontal internal, sehingga tidak mendorong paragraf berikutnya saat font dimuat.
2. **Tipografi Bersih (Prose)**: Menghindari styling ad-hoc dan menggunakan token tipografi terpusat yang menetapkan `line-height` proporsional untuk heading h1, h2, dan h3.

### Hasil Audit Google Lighthouse
- **Performance**: 100/100
- **Cumulative Layout Shift (CLS)**: 0.000 (Sempurna)
- **First Contentful Paint (FCP)**: 0.4 detik pada koneksi mobile 4G.',
  array['markdown', 'nextjs', 'core-web-vitals', 'typography', 'publiqa-blog'],
  null,
  null,
  'published',
  'Markdown Renderer Performa Tinggi Zero CLS | Tinkerbench Notes',
  'Arsitektur parser Markdown Server-Side Unified AST untuk platform editorial Publiqa.',
  now() - interval '18 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 9 ke Publiqa
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000009'::uuid, '10000000-0000-0000-0000-000000000009'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000009')
on conflict do nothing;


-- 10. Note: Strategi Scoped Multi-Font Google Fonts pada Single Repository Next.js
insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_path,
  cover_alt,
  publication_status,
  seo_title,
  seo_description,
  published_at
) values (
  '33333333-3333-3333-3333-000000000010',
  'Strategi Scoped Multi-Font Google Fonts pada Single Repository Next.js',
  'strategi-scoped-multi-font-google-fonts-nextjs',
  'Cara memuat 6 varian font unik untuk landing page berbeda tanpa membengkakkan FCP menggunakan next/font CSS variable scoping pada BrandLab.',
  'Proyek **BrandLab Launchpad** memiliki keunikan tersendiri: satu repositori Next.js App Router menampung 6 landing page bertema berbeda untuk vertikal industri yang beraneka ragam (Lumière, Brewly, Wearbase, Fitframe, Skillshift, dan Cozify).

Setiap landing page menuntut kombinasi tipografi Google Fonts yang berkarakter kuat (seperti *Playfair Display*, *Sora*, *Outfit*, *Space Grotesk*, dan *Cormorant Garamond*).

## Masalah: Global Font Bloat
Jika seluruh 6 font dimuat secara global pada file root `layout.tsx`, peramban klien akan mengunduh lebih dari 12 file varian bobot font (WOFF2) pada kunjungan pertama. Hal ini memicu pembengkakan bandwidth awal dan memperburuk skor *First Contentful Paint* (FCP).

### Solusi: Scoped CSS Variables per Route Group
Next.js menyediakan modul `next/font/google` yang mengunduh font pada saat *build-time* dan menyajikannya secara mandiri (*self-hosted*). Kami mendefinisikan font hanya di level sub-layout masing-masing rute:

```typescript
// app/(landing)/lumiere/layout.tsx
import { Playfair_Display, DM_Sans } from ''next/font/google'';

const playfair = Playfair_Display({
  subsets: [''latin''],
  variable: ''--font-serif-lumiere'',
  display: ''swap'',
});

const dmSans = DM_Sans({
  subsets: [''latin''],
  variable: ''--font-sans-lumiere'',
  display: ''swap'',
});

export default function LumiereLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${dmSans.variable} font-sans`}>
      {children}
    </div>
  );
}
```

Kemudian di file styling CSS:
```css
.lumiere-heading {
  font-family: var(--font-serif-lumiere), Georgia, serif;
}
```

### Hasil Optimasi
1. **Isolasi Aset**: Pengunjung halaman *Brewly* hanya mengunduh font *Sora* & *Inter*. Mereka tidak pernah membuang kuota data untuk font *Playfair* milik *Lumière*.
2. **Zero FOIT (*Flash of Invisible Text*)**: Menggunakan opsi `display: ''swap''` memastikan teks langsung terbaca sejak milidetik pertama sebelum font selesai terhidrasi.',
  array['nextjs', 'typography', 'web-perf', 'css', 'brandlab-launchpad'],
  null,
  null,
  'published',
  'Scoped Multi-Font Google Fonts di Next.js | Tinkerbench Notes',
  'Strategi isolasi dan scoping multi-font Google Fonts di Next.js App Router untuk BrandLab Launchpad.',
  now() - interval '20 days'
) on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  cover_path = excluded.cover_path,
  cover_alt = excluded.cover_alt,
  publication_status = excluded.publication_status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;

-- Hubungkan Note 10 ke BrandLab Launchpad
insert into public.post_projects (post_id, project_id)
select '33333333-3333-3333-3333-000000000010'::uuid, '10000000-0000-0000-0000-000000000010'::uuid
where exists (select 1 from public.projects where id = '10000000-0000-0000-0000-000000000010')
on conflict do nothing;
