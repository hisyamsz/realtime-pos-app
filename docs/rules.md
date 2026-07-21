# Aturan Validasi Kode (Code Validation Rules)

Setiap kali melakukan perubahan kode di dalam proyek ini, gunakan langkah-langkah verifikasi yang cepat untuk memastikan tidak ada error TypeScript atau masalah linting.

## Aturan Validasi Perubahan

Untuk memverifikasi perubahan kode secara efisien tanpa harus menjalankan proses build yang memakan waktu lama (`npm run build`), cukup jalankan perintah-perintah berikut:

1. **Pengecekan Tipe TypeScript:**

   ```bash
   npx tsc --noEmit
   ```

   _Perintah ini memastikan seluruh kode TypeScript valid dan tidak memiliki kesalahan tipe tanpa memproduksi output file._

2. **Pengecekan Linter:**
   ```bash
   npm run lint
   ```
   _Perintah ini memastikan kode mengikuti pedoman formatting dan standar kualitas kode yang telah dikonfigurasi._

> [!IMPORTANT]
> Semua perubahan **wajib** divalidasi menggunakan kedua perintah di atas dan harus lolos tanpa error sebelum dianggap selesai atau siap dipublikasikan/digabungkan. Hindari menjalankan `npm run build` untuk pengujian rutin karena memakan waktu yang cukup lama.
