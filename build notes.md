# Build Notes: Project Web Tracker Percepatan Belajar (Semester 3-7)

Dokumen ini berfungsi sebagai peta jalan dan pembagian tugas untuk seluruh sub-agent yang terlibat dalam pembangunan aplikasi Web Tracker. Setiap agent wajib membaca koordinasi tugas ini sebelum mengeksekusi kode.

## 👥 Alokasi Peran Sub-Agent

1. **Backend & Data Agent (Model: Gemini Pro - High)**
   - Fokus: Merancang struktur data (JSON), logika penyimpanan progres, dan routing data internal.
2. **Frontend & UI Agent (Model: Gemini Flash)**
   - Fokus: Membangun tampilan antarmuka (Dashboard, Leveling System, Progress Bar) menggunakan HTML/Tailwind CSS agar interaktif dan minimalis.
3. **Review & Testing Agent (Model: GPT OSS-120B)**
   - Fokus: Melakukan audit kode, mengecek *bug*, memastikan tidak ada *conflict*, dan memvalidasi kesesuaian dengan `agent protocol.md`.
4. **Log & Documentation Agent (Model: Gemini Pro - Low)**
   - Fokus: Mencatat setiap progres pengerjaan, mencatat kegagalan fungsi, dan memperbarui file `log.md`.

---

## 🛠️ Tahapan Pengembangan & Instruksi Kerja

### Fase 1: Struktur Data & Kurikulum (Backend Agent)
**Tugas Utama:** Mengubah peta materi Semester 3-7 menjadi struktur data yang siap dikonsumsi oleh Frontend.
- **Spesifikasi Data:** Buat file `data_materi.json` yang mengelompokkan mata kuliah ke dalam 5 Level Kesulitan (Pondasi, Software Engineering, AI & Data, Advanced System, Tahap Akhir).
- **Atribut per Materi:** Harus memiliki `id`, `nama_mk`, `semester_asal`, `sks`, `topik_inti` (array), dan status `is_completed` (boolean).
- **Output:** File `data_materi.json` dan skrip pembaca data (JavaScript/Python backend sederhana).

### Fase 2: Pembangunan Antarmuka / UI (Frontend Agent)
**Tugas Utama:** Membuat tampilan web tracker yang berfokus pada visualisasi *speedrun* belajar 2 bulan.
- **Komponen Wajib:**
  - **Dashboard Utama:** Menampilkan persentase total progres belajar global dari seluruh level.
  - **Level Roadmap View:** Tampilan vertikal atau berbasis *card* yang memisahkan Level 1 hingga Level 5. Level yang lebih tinggi terkunci/redup sebelum level di bawahnya selesai minimal 80%.
  - **Materi Detail Modal:** Ketika mata kuliah diklik, muncul daftar *topik_inti* yang bisa dicentang (*checkbox*).
- **Desain:** Minimalis, responsif, menggunakan tema gelap (*dark mode*) yang nyaman untuk belajar malam.
- **Output:** File `index.html`, `styles.css` (Tailwind), dan `app.js` untuk manipulasi DOM.

### Fase 3: Logika Sinkronisasi & Penyimpanan (Backend + Frontend)
**Tugas Utama:** Menyambungkan UI dengan data agar progres tidak hilang saat web di-*refresh*.
- Menggunakan *Local Storage* pada browser (atau skrip backend lokal) untuk menyimpan status `is_completed` dari setiap topik dan mata kuliah.
- Memastikan kalkulasi persentase *progress bar* berjalan *real-time* setiap kali ada topik yang dicentang.

### Fase 4: Quality Control & Audit (Review Agent)
**Tugas Utama:** Memastikan kode bersih dan siap dijalankan tanpa error.
- Periksa kerapian penulisan kode (*clean code*).
- Uji coba skenario ekstrem (misal: mencentang semua materi sekaligus, atau mengosongkan data *Local Storage*).
- Jika ada *bug*, kembalikan instruksi perbaikan ke Backend atau Frontend Agent terkait.

### Fase 5: Pelaporan (Log Agent)
**Tugas Utama:** Mencatat hasil akhir pengerjaan.
- Setelah Review Agent menyatakan aman, perbarui file `log.md` dengan format yang sudah ditentukan.

---

## 📌 Batasan Teknis & Aturan Tambahan
- Seluruh kode harus ditulis dengan pendekatan modular agar mudah dirawat jika ada penambahan fitur di kemudian hari.
- Jangan gunakan *library* pihak ketiga yang terlalu berat jika komponen bisa dibuat dengan vanilla JavaScript atau Tailwind standar.