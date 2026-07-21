---
title: 'Product Requirements Document (PRD) — Omni POS'
version: '1.0'
status: 'Draft'
author: 'Hisyam Santoso'
stack: 'Next.js 15 + React 19 + Supabase + TypeScript'
last_updated: '2026-07-21'
---

# Omni POS — Product Requirements Document (PRD)

> **Version:** 1.0 · **Status:** Draft · **Author:** Hisyam Santoso
>
> **Tech Stack:** Next.js 15 · React 19 · Supabase · TypeScript

---

## 1. Overview

### 1.1 Product Name

**Omni POS**

### 1.2 Product Description

Omni POS adalah aplikasi Point of Sale (POS) berbasis web yang dirancang khusus untuk cafe dan restoran. Sistem memungkinkan proses pemesanan, pembayaran, monitoring dapur, dan pelaporan berjalan secara realtime menggunakan Supabase Realtime.

Aplikasi memiliki beberapa role (Administrator, Kasir, Kitchen Staff) sehingga setiap pengguna memperoleh tampilan dashboard yang berbeda sesuai tanggung jawabnya.

### 1.3 Problem Statement

Target utama aplikasi adalah menggantikan proses pencatatan manual dengan sistem digital yang cepat, akurat, dan realtime.

---

## 2. Goals

### 2.1 Business Goals

- Mempermudah operasional restoran
- Mempercepat proses transaksi
- Mengurangi human error
- Mempermudah monitoring penjualan
- Mendukung pembayaran online menggunakan Midtrans

### 2.2 Technical Goals

- Menggunakan Next.js App Router
- Menggunakan React Server Component
- Menggunakan Server Action
- Menggunakan React 19
- Menggunakan Realtime Database (Supabase Realtime)
- Clean Architecture
- Full TypeScript
- Production Ready

---

## 3. Target Users & Roles

### 3.1 Admin

**Deskripsi:** Mengelola seluruh sistem.

**Hak Akses:**

- User Management
- Menu Management
- Table Management
- Reporting
- Dashboard
- Role Management

### 3.2 Cashier

**Deskripsi:** Bertugas menerima pembayaran.

**Hak Akses:**

- Order List
- Payment
- Print Receipt
- Transaction History

### 3.3 Kitchen

**Deskripsi:** Bertugas menyiapkan makanan.

**Hak Akses:**

- View Incoming Order
- Update Cooking Status

---

## 4. User Flow

```
Login → Dashboard → Select Role → Role Dashboard
  → Create Order
  → Kitchen Receive Order (Realtime)
  → Kitchen Update Status
  → Cashier Receive Notification
  → Payment
  → Receipt
  → Completed
```

---

## 5. Functional Requirements

### 5.1 Authentication

**Features:**

- Login
- Logout
- Protected Route
- Session Management
- Role-Based Access Control (RBAC)

**Technology:** Supabase Auth, Server Action

### 5.2 Dashboard

**Features:**

- Statistics Cards:
  - Today's Revenue
  - Today's Orders
  - Active Tables
  - Reserved Tables
- Popular Menu
- Sales Chart

### 5.3 User Management

**Operation:** CRUD User

**Fields:**

| Field     | Keterangan                |
| --------- | ------------------------- |
| Full Name | Nama lengkap user         |
| Email     | Email login               |
| Password  | Password login            |
| Avatar    | Foto profil               |
| Role      | Admin / Cashier / Kitchen |

### 5.4 Menu Management

**Operation:** CRUD Menu

**Fields:**

| Field            | Keterangan                    |
| ---------------- | ----------------------------- |
| Image            | Foto menu                     |
| Menu Name        | Nama menu                     |
| Category         | Relasi ke Category Management |
| Price            | Harga menu                    |
| Stock            | Jumlah stok tersedia          |
| Description      | Deskripsi menu                |
| Available Status | Status ketersediaan menu      |

### 5.5 Category Management

**Operation:** CRUD Category

**Fields:**

| Field         | Keterangan    |
| ------------- | ------------- |
| Category Name | Nama kategori |

### 5.6 Table Management

**Operation:** CRUD Table

**Fields:**

| Field        | Keterangan                      |
| ------------ | ------------------------------- |
| Table Number | Nomor meja                      |
| Capacity     | Kapasitas kursi                 |
| Status       | Available / Reserved / Occupied |

### 5.7 Order Management

**Features:**

- Create Order
- Order Detail
- Cart
- Quantity
- Notes (catatan per item)
- Discount
- Tax
- Service Fee
- Split Bill _(Future)_

**Order Status Flow:**

```
Pending → Preparing → Ready → Completed
                            ↘ Cancelled
```

### 5.8 Kitchen Dashboard

**Features:**

- Realtime Incoming Order
- Realtime Status Update
- Cooking Timer
- Completed Notification

### 5.9 Cart

**Features:**

- Add Item
- Remove Item
- Update Quantity
- Order Notes
- Subtotal
- Tax
- Discount
- Grand Total

### 5.10 Payment

**Payment Methods:**

- Cash
- QRIS
- Credit Card
- Virtual Account
- E-Wallet

**Technology:** Midtrans Snap

### 5.11 Reporting

**Report Types:**

- Sales Today
- Sales Monthly
- Sales Yearly
- Revenue
- Popular Menu
- Best Employee
- Order Count
- Cancelled Order

---

## 6. Non-Functional Requirements

| Kategori     | Requirement                                                        |
| ------------ | ------------------------------------------------------------------ |
| Performance  | Response time < 500ms                                              |
| Availability | Uptime 99%                                                         |
| Security     | Authentication, Authorization, RLS Supabase, Environment Variables |
| Scalability  | Multi-Restaurant Ready                                             |
| Responsive   | Desktop, Tablet, Mobile                                            |

---

## 7. Tech Stack

| Layer            | Technology                                                |
| ---------------- | --------------------------------------------------------- |
| Frontend         | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI |
| State Management | Zustand                                                   |
| Server State     | TanStack React Query                                      |
| Form             | React Hook Form, Zod                                      |
| Database         | PostgreSQL (Supabase)                                     |
| Authentication   | Supabase Auth                                             |
| Storage          | Supabase Storage                                          |
| Payment          | Midtrans                                                  |
| Deployment       | Vercel                                                    |

---

## 8. Database Schema

### 8.1 Core Tables

| Table                  | Deskripsi                             |
| ---------------------- | ------------------------------------- |
| `users`                | Data akun pengguna (Supabase Auth)    |
| `profiles`             | Profil pengguna (nama, avatar)        |
| `roles`                | Daftar role (Admin, Cashier, Kitchen) |
| `categories`           | Kategori menu                         |
| `menus`                | Data menu makanan/minuman             |
| `tables`               | Data meja restoran                    |
| `orders`               | Data pesanan                          |
| `order_items`          | Detail item per pesanan               |
| `payments`             | Data pembayaran                       |
| `payment_transactions` | Log transaksi pembayaran              |
| `reservations`         | Data reservasi meja                   |
| `activity_logs`        | Log aktivitas pengguna                |

---

## 9. Folder Structure

```
src/
├── app/              # Next.js App Router (pages & layouts)
├── components/       # Shared/reusable UI components
├── features/         # Feature-based modules
├── hooks/            # Custom React hooks
├── actions/          # Server Actions
├── services/         # Business logic / service layer
├── repositories/     # Data access layer (Supabase queries)
├── schemas/          # Zod validation schemas
├── types/            # TypeScript type definitions
├── stores/           # Zustand stores
├── constants/        # App-wide constants
├── lib/              # Library configurations (Supabase client, etc.)
├── utils/            # Utility/helper functions
├── providers/        # React context providers
└── middleware.ts     # Next.js middleware (auth, redirects)
```

---

## 10. Realtime Features

**Technology:** Supabase Realtime

**Realtime Events:**

| Event                | Deskripsi                                 |
| -------------------- | ----------------------------------------- |
| New Order            | Notifikasi pesanan baru ke Kitchen        |
| Update Order Status  | Update status pesanan (Preparing → Ready) |
| Payment Success      | Konfirmasi pembayaran berhasil            |
| Table Status         | Update status meja secara realtime        |
| Kitchen Notification | Notifikasi dari dapur ke kasir            |
| Reservation Update   | Update status reservasi meja              |

---

## 11. UI Pages

### 11.1 Authentication

- `/login` — Login Page

### 11.2 Dashboard

- `/dashboard/admin` — Admin Dashboard
- `/dashboard/cashier` — Cashier Dashboard
- `/dashboard/kitchen` — Kitchen Dashboard

### 11.3 Master Data

- `/dashboard/users` — User Management
- `/dashboard/menus` — Menu Management
- `/dashboard/categories` — Category Management
- `/dashboard/tables` — Table Management

### 11.4 Transaction

- `/dashboard/orders` — Order Management
- `/dashboard/payment` — Payment
- `/dashboard/receipt` — Receipt

### 11.5 Reports

- `/dashboard/reports` — Reporting & Analytics

### 11.6 Settings

- `/dashboard/settings/profile` — Profile Settings

---

## 12. Milestones

| Phase   | Scope                                                                                              | Status  |
| ------- | -------------------------------------------------------------------------------------------------- | ------- |
| Phase 1 | Authentication, Dashboard, User Management, Menu Management, Category Management, Table Management | Planned |
| Phase 2 | Order Management, Cart, Kitchen Dashboard, Realtime Order                                          | Planned |
| Phase 3 | Midtrans Integration, Payment, Receipt                                                             | Planned |
| Phase 4 | Reporting, Charts, Analytics                                                                       | Planned |
| Phase 5 | Deployment, Performance Optimization, SEO, Security Hardening                                      | Planned |

---

## 13. Future Enhancements

| Category         | Enhancement                                                          |
| ---------------- | -------------------------------------------------------------------- |
| Multi-Outlet     | Multi Branch Restaurant                                              |
| Customer Loyalty | Customer Membership, Loyalty Point, Voucher System, Promo Management |
| Inventory        | Inventory Management, Purchase Order, Supplier Management            |
| Kitchen          | Kitchen Display System (KDS)                                         |
| Hardware         | Barcode Scanner                                                      |
| Customer Facing  | QR Menu, Customer Self Ordering                                      |
| Payment          | Split Bill, Multi Payment, Refund                                    |
| Offline & Mobile | Offline Mode (PWA), Push Notification, Mobile App (React Native)     |
| AI / ML          | AI Sales Prediction, AI Menu Recommendation                          |
| Export & Audit   | Export Excel & PDF, Audit Log, Activity Monitoring                   |

---

## 14. Success Metrics (KPIs)

| Metric                    | Target     |
| ------------------------- | ---------- |
| Login Success Rate        | > 99%      |
| Order Creation Time       | < 10 detik |
| Payment Processing        | < 5 detik  |
| Realtime Update Delay     | < 1 detik  |
| Lighthouse Performance    | > 90       |
| Lighthouse Accessibility  | > 90       |
| Lighthouse Best Practices | > 95       |
| Lighthouse SEO            | > 90       |

---

## 15. Learning Objectives

Melalui proyek ini, tujuan pembelajaran bukan hanya menghasilkan aplikasi POS, tetapi juga menguasai praktik pengembangan aplikasi modern yang siap digunakan di industri. Setelah proyek selesai, diharapkan mampu:

- Membangun aplikasi full-stack menggunakan Next.js 15 dan React 19
- Memahami React Server Components, Server Actions, dan App Router
- Mendesain database PostgreSQL menggunakan Supabase
- Mengimplementasikan autentikasi dan otorisasi berbasis role
- Mengelola state lokal dengan Zustand dan server state menggunakan TanStack React Query
- Menerapkan validasi form menggunakan React Hook Form dan Zod
- Membangun fitur realtime menggunakan Supabase Realtime
- Mengintegrasikan payment gateway Midtrans
- Menerapkan arsitektur aplikasi yang modular dan scalable
- Melakukan deployment aplikasi ke Vercel dengan praktik produksi yang baik

---
