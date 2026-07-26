# Aturan Pengembangan & Validasi Kode (Code Rules & Workflows)

Setiap kali bekerja di dalam proyek ini, gunakan pedoman berikut untuk eksplorasi arsitektur dan verifikasi kode.

## 1. Navigasi & Eksplorasi Kode (Graphify Knowledge Base)

Untuk memahami arsitektur codebase, hubungan antar komponen, atau struktur proyek pada sesi baru:
- **Dilarang melakukan scan direktori atau grep manual satu per satu.**
- **Wajib periksa dahulu laporan pengetahuan arsitektur di `graphify-out/GRAPH_REPORT.md`** (serta memanfaatkan file/tools pendukung di folder `graphify-out/`). Ini memberikan peta arsitektur lengkap (God Nodes, Community Hubs, Dependency Tree) secara langsung tanpa pemindaian ulang.

## 2. Aturan Validasi Perubahan Kode

### 1. Perubahan Kode TypeScript / JavaScript (Logika & Fungsionalitas)
Setiap kali mengubah kode TypeScript atau JavaScript yang melibatkan logika/fungsionalitas, **wajib** melakukan pengecekan tipe TypeScript dan linter untuk memastikan tidak ada kesalahan:

- **Pengecekan Tipe TypeScript:**
  ```bash
  npx tsc --noEmit
  ```
  _Memastikan seluruh kode TypeScript valid dan tidak memiliki kesalahan tipe tanpa memproduksi output file._

- **Pengecekan Linter:**
  ```bash
  npm run lint
  ```
  _Memastikan kode mengikuti pedoman standar kualitas dan kelayakan kode._

### 2. Perubahan Khusus Style / Styling Component
Jika **hanya** mengubah bagian tampilan atau styling komponen (seperti class Tailwind), **tidak perlu** menjalankan verifikasi TypeScript (`npx tsc --noEmit`). Cukup jalankan perintah format agar pengurutan class Tailwind berjalan otomatis:

- **Formatting & Class Sorting:**
  ```bash
  npm run format
  ```
  _Menjalankan Prettier untuk merapikan format kode serta menyusun/mengurutkan class Tailwind secara otomatis._

---

> [!IMPORTANT]
> - Hindari menjalankan `npm run build` untuk pengujian rutin karena memakan waktu yang cukup lama.
> - Pastikan selalu memilih langkah verifikasi yang sesuai (Pengecekan TypeScript/Linter untuk perubahan logika kode, dan `npm run format` untuk perubahan styling).
