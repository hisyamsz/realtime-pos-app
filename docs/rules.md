# Aturan Validasi Kode (Code Validation Rules)

Setiap kali melakukan perubahan kode di dalam proyek ini, gunakan langkah-langkah verifikasi yang sesuai dengan jenis perubahan yang dilakukan.

## Aturan Validasi Perubahan

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
