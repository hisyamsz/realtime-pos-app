# Workspace Rules

Aturan proyek wajib dipatuhi tiap tugas:

## Inisialisasi Sesi Baru (New Session Context)

Saat sesi baru dibuka/dibuat, AI agent jalankan langkah awal efisien:

1. **Pemahaman Arsitektur (Graphify Knowledge Base)**:
   - **Jangan scan folder / grep manual satu-per-satu** untuk paham arsitektur.
   - **Wajib baca [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md)** untuk ringkasan visual, _God Nodes_, batas _Communities_, _Surprising Connections_.
   - Jika tanya aliran data / relasi modul, pakai `graphify query "<pertanyaan>"` atau kueri `graphify-out/graph.json`.

2. **Aturan Bisnis & Desain Sistem**:
   - Cek spesifikasi desain & PRD di `docs/PRD.md` dan `docs/design/DESIGN.md` untuk standar komponen, skema warna (Nike Soft Cloud Dark Mode), workflow validasi.

---

## Alur Kerja Pengembangan (Development Workflow)

1. **Perubahan Kode TS/JS (Logika & Fungsionalitas)**:
   Wajib verifikasi TypeScript (`npx tsc --noEmit`) + linter (`npm run lint`).

2. **Perubahan Khusus Style / Styling Component**:
   Skip TypeScript check (`npx tsc --noEmit`). Cukup format (`npm run format`) untuk auto-sort class Tailwind.
