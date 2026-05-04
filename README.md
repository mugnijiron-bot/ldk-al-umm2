# LDK Al Umm — Sistem Informasi Manajemen Organisasi

**Lembaga Dakwah Kampus Al Umm**  
Universitas Muhammadiyah Sukabumi (UMMI)

---

## 📋 Tentang Aplikasi

Aplikasi web manajemen organisasi untuk LDK Al Umm UMMI Sukabumi. Dibangun menggunakan **HTML, CSS, dan JavaScript murni** (tanpa framework/library tambahan) dengan penyimpanan data berbasis `localStorage` browser.

## 🔑 Akun Default

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | admin@ldkalumm.com | password |
| Ketua DKM | taufiq@ldkalumm.com | password |
| Ketua Kewirausahaan | anisa@ldkalumm.com | password |
| Ketua Media | gilang@ldkalumm.com | password |
| Ketua Syiar | jeantly@ldkalumm.com | password |
| Ketua Kemuslimahan | susi@ldkalumm.com | password |
| Ketua Humas | mujib@ldkalumm.com | password |
| Anggota Biasa | anggota@ldkalumm.com | password |

---

## ✨ Fitur Lengkap

### 🔐 Autentikasi
- Login & Registrasi dengan verifikasi admin
- 4 level akses: Admin, Ketua, Pengurus, Anggota

### 🏛️ Manajemen Divisi (6 Bidang)
- Bidang DKM (Dewan Kemakmuran Masjid)
- Bidang Kewirausahaan
- Bidang Media
- Divisi Syiar
- Bidang Kemuslimahan
- Bidang Humas

### 📋 Program Kerja (20 Program)
- CRUD penuh per divisi
- Detail lengkap: dasar, tujuan, sasaran, waktu, tempat, anggaran, PJ, indikator

### 📅 Kalender Kegiatan
- Tampilan kalender bulanan interaktif
- Daftar semua kegiatan
- Tambah/edit/hapus kegiatan

### 💰 Manajemen Keuangan
- Input anggaran optimis & realistis per program
- Rekapitulasi per divisi dan total
- Progress bar serapan anggaran
- Riwayat pengeluaran per program

### 📢 Pengumuman
- Buat, lihat, dan hapus pengumuman
- Tandai sebagai "Penting"
- Notifikasi di topbar

### 📁 Dokumentasi Kegiatan
- Laporan kegiatan per program
- Riwayat lengkap aktivitas

### 📊 Indikator Keberhasilan
- Input target & realisasi (kualitatif & kuantitatif)
- Tracking per bulan/periode

### 👥 Manajemen User (Admin)
- Verifikasi akun baru
- Ubah role user
- Hapus user

### 📄 Export
- Export detail program ke PDF (print dialog browser)

---

## 🗂️ Struktur File

```
ldk-alumm/
├── index.html          # Entry point utama
├── css/
│   └── style.css       # Semua styling (design system)
├── js/
│   ├── db.js           # Database layer (localStorage) + seeder data
│   └── app.js          # Router, UI components, dan semua halaman
└── README.md           # Dokumentasi ini
```

---

## 🗄️ Struktur Data (Tabel Virtual)

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna dengan role dan status verifikasi |
| `divisions` | 6 divisi/bidang LDK |
| `division_boards` | Susunan pengurus harian tiap divisi |
| `work_programs` | 20 program kerja dengan detail lengkap |
| `events` | Jadwal kegiatan untuk kalender |
| `announcements` | Pengumuman organisasi |
| `budget_reports` | Laporan realisasi anggaran |
| `program_activities` | Dokumentasi pelaksanaan kegiatan |
| `achievement_indicators` | Data indikator keberhasilan program |

---

## 🔄 Reset Data

Jika ingin mengembalikan data ke kondisi awal (seeder):
1. Login sebagai Admin
2. Buka menu **Profil**
3. Klik tombol **Reset Data (Admin)**

Atau hapus `localStorage` browser secara manual:
- Buka DevTools (F12) → Application → Local Storage → Hapus semua key `ldk_*`

---

## 🎨 Teknologi

- **HTML5** — Struktur halaman
- **CSS3** — Styling dengan CSS Variables dan custom design system
- **JavaScript (ES6+)** — Logika aplikasi, routing, CRUD
- **localStorage** — Penyimpanan data persisten di browser
- **Google Fonts** — Amiri (display) + Plus Jakarta Sans (body)

---

## 📱 Responsif

Aplikasi mendukung tampilan:
- 💻 Desktop (sidebar tetap)
- 📱 Mobile (sidebar collapsible dengan toggle)

---

*بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ*
