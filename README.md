# TaskPilot — Minimalist Task Management SaaS

A clean, modern, scalable, and responsive **Task Management Web Application** designed with a product-oriented SaaS aesthetic (inspired by Linear, Notion, and Vercel). Built using Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, and Prisma ORM.

---

## 🚀 Live Demo & Repository
- **Live URL**: [Deploy on Vercel](#deployment-guide-vercel--neon)
- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL

---

## ✨ Fitur Utama

### 1. Dashboard Overview
- **Statistik Real-time**: Total tasks, Todo, In Progress, Completed, dan rasio penyelesaian (completion rate).
- **Visual Analytics**: Grafik batang distribusi status dan grafik lingkaran tingkat prioritas (menggunakan Recharts).
- **Upcoming Deadlines**: Menampilkan daftar tugas dengan tenggat waktu terdekat dan indikator keterlambatan (overdue).
- **Recent Tasks**: Menampilkan tugas-tugas terbaru yang ditambahkan ke sistem.

### 2. Task Management (CRUD Lengkap)
- **Create**: Tambah tugas baru dengan judul, deskripsi, status, tingkat prioritas, dan batas waktu deadline.
- **Read**: Tabel daftar tugas interaktif dan modal detail tugas lengkap.
- **Update**: Edit tugas kapan saja serta fitur **Quick Status Change** langsung dari menu dropdown.
- **Delete**: Hapus tugas dengan dialog konfirmasi (*Alert Dialog*) untuk mencegah penghapusan yang tidak disengaja.

### 3. Search, Filter, & Sorting
- **Search**: Pencarian instan berdasarkan judul atau deskripsi tugas.
- **Status Filter**: Filter berdasarkan *Semua*, *Todo*, *In Progress*, atau *Completed*.
- **Priority Filter**: Filter berdasarkan tingkat urgensi (*Low*, *Medium*, *High*).
- **Deadline Filter**: Filter berdasarkan *Hari Ini*, *7 Hari Ke Depan*, dan *Terlewat (Overdue)*.
- **Multi-criteria Sorting**: Pengurutan berdasarkan tanggal dibuat (terbaru/terlama), deadline terdekat/terjauh, dan nama A-Z.

### 4. UI/UX Design System
- **Minimalist Aesthetic**: Menghindari elemen dekoratif berlebihan, bayangan tebal, dan gradien tajam.
- **Subtle Badges**: Status dan prioritas menggunakan warna lembut (*subtle blue, amber, rose, emerald, neutral zinc*).
- **Responsive Layout**: Sidebar navigasi desktop dan drawer navigasi mobile yang rapi.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com/) / Radix UI |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma ORM](https://www.prisma.io/) |
| **Form & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Date Handling** | [date-fns](https://date-fns.org/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## 📁 Struktur Folder Project

```
├── actions/              # Next.js Server Actions (Database queries & mutations)
│   └── tasks.ts
├── app/                  # Next.js App Router (Layout, Pages, Styling)
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx          # Dashboard page
│   └── tasks/
│       └── page.tsx      # Task list & management page
├── components/           # UI Components
│   ├── ui/               # shadcn/ui primitives (Button, Dialog, Table, Select, dll)
│   ├── dashboard-charts.tsx
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── stat-card.tsx
│   ├── task-delete-dialog.tsx
│   ├── task-detail-dialog.tsx
│   ├── task-filters.tsx
│   ├── task-form-dialog.tsx
│   ├── task-priority-badge.tsx
│   ├── task-status-badge.tsx
│   ├── task-table.tsx
│   └── tasks-view.tsx
├── lib/                  # Utilities & Prisma Client singleton
│   ├── prisma.ts
│   └── utils.ts
├── prisma/               # Schema database & Seeding script
│   ├── schema.prisma
│   └── seed.ts
├── schemas/              # Zod validation schemas
│   └── task.ts
└── types/                # TypeScript interface & types
    └── index.ts
```

---

## 💻 Panduan Menjalankan Secara Lokal

### 1. Clone Repository & Install Dependency
```bash
git clone https://github.com/username/task-management.git
cd task-management
pnpm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilai `DATABASE_URL` dengan database PostgreSQL lokal atau cloud Anda:
```env
# Contoh PostgreSQL Lokal:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Atau gunakan PostgreSQL Cloud Gratis (Neon / Supabase):
# DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

### 3. Migrasi Database & Seeding Data
Jalankan perintah berikut untuk membuat tabel dan mengisi data percontohan awal:
```bash
# Terapkan migrasi yang tersimpan di prisma/migrations
pnpm db:migrate

# Generate Prisma Client
pnpm db:generate

# Isi data contoh untuk demo portofolio
pnpm db:seed
```

### 4. Jalankan Development Server
```bash
pnpm dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🚢 Panduan Deployment (Vercel & Neon PostgreSQL)

Aplikasi ini dapat di-deploy ke **Vercel** dengan database PostgreSQL seperti Neon atau Supabase. Ini adalah demo publik tanpa autentikasi: siapa pun yang membuka aplikasi dapat melihat dan mengubah daftar tugas. Jangan simpan data pribadi atau rahasia.

1. **Buat Database PostgreSQL di Cloud**:
   - Daftar di [Neon.tech](https://neon.tech/) atau [Supabase](https://supabase.com/).
   - Buat project baru dan salin *Connection String* PostgreSQL yang diberikan.
2. **Push Repository ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete TaskPilot application"
   git remote add origin https://github.com/YOUR_USERNAME/taskpilot.git
   git push -u origin main
   ```
3. **Siapkan environment variables di Vercel**:
   - Masuk ke dashboard [Vercel](https://vercel.com/) dan klik **Add New Project**.
   - Import repository GitHub Anda.
   - Pada bagian **Environment Variables**, tambahkan `DATABASE_URL` dengan connection string PostgreSQL.
   - Atur variabel untuk environment yang akan digunakan (**Production**, dan **Preview** bila diperlukan). Hindari memakai database produksi untuk Preview.
4. **Terapkan migrasi ke database**:
   - Sebelum aplikasi menerima traffic, arahkan `DATABASE_URL` lokal ke database yang akan digunakan (misalnya dengan memperbarui `.env` secara sementara).
   - Jalankan:
     ```bash
     pnpm db:migrate:deploy
     ```
   - Jangan gunakan `prisma db push` untuk deployment; migrasi tersimpan di repository dan `migrate deploy` menerapkannya tanpa membuat perubahan skema interaktif.
5. **Deploy di Vercel**:
   - Klik **Deploy** setelah environment variable dan migrasi siap.
   - Build command default `pnpm build` menjalankan `prisma generate && next build`; migrasi database sengaja dijalankan secara terpisah.

---

## 📄 Lisensi
MIT License — Bebas digunakan dan dimodifikasi untuk proyek portofolio pribadi.
