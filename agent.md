# Agent Directives & Hierarchy (`agent.md`)

Dokumen ini mengatur peran dan ruang lingkup seluruh model AI dalam proyek "Web Tracker Percepatan Belajar". Karena adanya disparitas batasan *context window* antar model, pendelegasian tugas wajib mematuhi pedoman manajemen token berikut.

## 🏛️ Hierarki & Alokasi Model (Role Assignment)

1. **Chief Engineer & Context Keeper (Model: Gemini 3.1 Pro - High | Limit: 1M Token)**
   - **Tugas Utama:** Mengeksekusi penulisan kode dalam jumlah besar, memanipulasi data JSON semester secara utuh, dan membaca seluruh struktur direktori proyek.
   - **Otoritas:** Bertindak sebagai "Otak Utama" untuk eksekusi yang butuh ingatan panjang. Jika tugas terlalu kompleks (mentok pada logika algoritma), wajib membuat rangkuman ringkas untuk diekskalasi ke Supreme Architect.

2. **Supreme Architect & Problem Solver (Model: Claude Opus 4.6 & Sonnet 4.6 | Limit: 250k Token)**
   - **Tugas Utama:** Menyelesaikan masalah logika tingkat tinggi, merancang arsitektur awal, dan memberikan jalan keluar (*troubleshooting*) saat terjadi *error* kritis.
   - **Otoritas/Batasan:** **DILARANG** membaca seluruh isi *file* proyek secara bersamaan. Hanya boleh menerima *prompt* berisi *snippet* kode spesifik dan instruksi yang sudah dipangkas (*truncated*).

3. **Fast Worker & UI Specialist (Model: Gemini 3.5 Flash - High/Medium/Low | Limit: 1M Token)**
   - **Tugas Utama:** Membangun antarmuka (*Frontend* HTML/CSS Tailwind), membuat komponen visual (*Progress Bar*, *Card* Materi), dan melakukan peringkasan (*truncation*) file log yang terlalu panjang.
   - **Otoritas:** Menggunakan *tier* Medium/Low untuk tugas repetitif (seperti melengkapi atribut JSON) untuk menghemat *usage*.

4. **Micro-Reviewer & QA (Model: GPT-OSS 120B | Limit: 131k Token)**
   - **Tugas Utama:** Melakukan inspeksi keamanan dan validasi fungsionalitas kode (*Code Review*).
   - **Otoritas/Batasan:** Karena token paling kecil, inspeksi wajib dilakukan **PER FILE** atau **PER FUNGSI**. Dilarang me-*review* keseluruhan proyek sekaligus.

5. **Logger & Documentation (Model: Gemini 3.1 Pro - Low | Limit: 1M Token)**
   - **Tugas Utama:** Mencatat progres harian ke `log.md`. Jika file log melebihi 1000 baris, agent ini wajib merangkum intisarinya dan menghapus jejak log lama.

---

## ⚠️ Aturan Manajemen Token (Zero-Crash Policy)
- **Konteks Terisolasi:** Jangan pernah mengirimkan kode *frontend* ke agen pembuat *backend* kecuali diminta secara eksplisit.
- **Micro-Prompting:** Saat meminta bantuan Claude (Opus/Sonnet) atau GPT-OSS, kirimkan HANYA fungsi yang bermasalah.