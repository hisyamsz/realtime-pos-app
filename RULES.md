# Workspace Rules

Selalu patuhi aturan proyek yang ditentukan di bawah ini setiap kali melakukan tugas dalam proyek ini:

## Inisialisasi Sesi Baru (New Session Context)

Saat sesi baru pertama kali dibuka/dibuat, agen AI wajib menjalankan langkah-langkah konteks awal berikut secara efisien:

1. **Pemahaman Arsitektur (Graphify Knowledge Base)**:
   - **Jangan melakukan scan folder atau grep manual satu-per-satu** hanya untuk memahami arsitektur atau keterkaitan kode.
   - **Wajib langsung membaca [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md)** untuk melihat ringkasan visual, _God Nodes_, batas _Communities_, dan _Surprising Connections_.
   - Jika pengguna mengajukan pertanyaan umum tentang aliran data atau keterhubungan modul, manfaatkan `graphify query "<pertanyaan>"` atau kueri langsung ke `graphify-out/graph.json`.

2. **Aturan Bisnis & Desain Sistem**:
   - Periksa spesifikasi desain & PRD di `docs/PRD.md`, `docs/design/DESIGN.md`, dan `docs/rules.md` untuk memahami standar komponen, skema warna (Nike Soft Cloud Dark Mode), serta workflow validasi.

---

## Alur Kerja Pengembangan (Development Workflow)

1. **Perubahan Kode TS/JS (Logika & Fungsionalitas)**:
   Wajib jalankan verifikasi TypeScript (`npx tsc --noEmit`) dan linter (`npm run lint`) untuk memastikan tidak ada kesalahan tipe atau standar kode.

2. **Perubahan Khusus Style / Styling Component**:
   Tidak perlu menjalankan verifikasi TypeScript (`npx tsc --noEmit`). Cukup jalankan format (`npm run format`) agar pengurutan class Tailwind (_Tailwind class sorting_) berjalan secara otomatis.
