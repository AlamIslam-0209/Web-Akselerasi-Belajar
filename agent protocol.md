# Agent Protocol & Definition of Done (`agent protocol.md`)

Dokumen ini berisi *Standard Operating Procedure* (SOP) pengerjaan dan metrik kelulusan tugas agar semua agent bekerja dengan standar yang seragam.

## 🔄 Alur Kerja Bertenaga Token (Token-Optimized Workflow)

1. **[INIT & PLAN]** Gemini 3.1 Pro (High) membaca `build notes.md` dan membagi draf tugas kasaran.
2. **[REFINE]** (Opsional) Jika tugas butuh algoritma rumit (misal: struktur *Tree/Graph* untuk dependensi mata kuliah), kirim spesifikasi singkat ke Claude Opus/Sonnet untuk mendapatkan rancangan logikanya.
3. **[CODE]** Eksekusi kode dilakukan oleh Gemini 3.1 Pro (Backend/Data) dan Gemini 3.5 Flash (UI/Frontend).
4. **[MICRO-TEST]** GPT-OSS 120B menerima HANYA *file* atau fungsi yang baru selesai ditulis untuk diperiksa (*linting/dry-run*).
5. **[LOG]** Gemini 3.1 Pro (Low) mencatat hasil persetujuan ke `log.md`.
6. **[VERSION CONTROL]** Setelah Logger mencatat progres, agent WAJIB mengeksekusi perintah terminal berikut untuk menyimpan perubahan:
   - `git add .`
   - `git commit -m "[NAMA_AGENT] - [Aksi yang dilakukan]"`
   (Contoh: `git commit -m "Gemini Flash - Buat struktur awal index.html"`)

---

## ✅ Definition of Done (DoD) - Kriteria Selesai

Sebuah siklus tugas baru dianggap **SELESAI** apabila memenuhi syarat berikut:

### Kriteria UI/Frontend (Web Tracker)
- [ ] Render tampilan tidak pecah di layar *Mobile* maupun Desktop.
- [ ] Penggunaan *Class* Tailwind CSS berjalan efisien (tidak ada *style* yang bertumpuk/berulang).
- [ ] *Event Listener* pada *Checkbox* materi berhasil ditangkap oleh DOM tanpa *delay*.

### Kriteria Logika & Data (JSON & Local Storage)
- [ ] File `data_materi.json` valid secara struktur dan dapat di-*parse* oleh JavaScript tanpa pesan *error* di *Console Browser*.
- [ ] Status materi tersimpan sempurna di *Local Storage*. (Buktikan dengan skenario *refresh* halaman, progres persentase tidak boleh kembali ke 0%).

### Kriteria QA (Quality Assurance)
- [ ] GPT-OSS 120B memberikan persetujuan dengan *output* teks: `"MICRO-REVIEW PASSED"`.
- [ ] Tidak ada fungsi (*function*) yang memiliki panjang lebih dari 100 baris kode (jika ada, wajib dipecah menjadi fungsi yang lebih kecil).

## 🛑 Fallback & Error Handling
Jika terjadi kegagalan sistematis (misal kode terus *error* setelah 3 kali diperbaiki oleh Gemini):
1. Stop eksekusi pada agen saat ini.
2. Gemini 3.1 Pro wajib membuat file ringkasan: `error_report.txt` (Maksimal 1500 kata).
3. Serahkan `error_report.txt` tersebut kepada **Claude Opus 4.6** untuk dianalisis jalan keluarnya.