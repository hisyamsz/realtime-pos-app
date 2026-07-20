---

# Product Requirements Document (PRD)

# Omni POS

**Version:** 1.0

**Status:** Draft

**Author:** Hisyam Santoso

**Stack:** Next.js 15 + React 19 + Supabase + TypeScript

---

# 1. Overview

## Product Name

Omni POS

## Product Description

Omni POS adalah aplikasi Point of Sale (POS) berbasis web yang dirancang khusus untuk cafe dan restoran. Sistem memungkinkan proses pemesanan, pembayaran, monitoring dapur, dan pelaporan berjalan secara realtime menggunakan Supabase Realtime.

Aplikasi memiliki beberapa role seperti Administrator, Kasir, Waiter, Kitchen Staff, dan Owner sehingga setiap pengguna memperoleh tampilan dashboard yang berbeda sesuai tanggung jawabnya.

Target utama aplikasi adalah menggantikan proses pencatatan manual dengan sistem digital yang cepat, akurat, dan realtime.

---

# 2. Goals

## Business Goals

- Mempermudah operasional restoran
- Mempercepat proses transaksi
- Mengurangi human error
- Mempermudah monitoring penjualan
- Mendukung pembayaran online menggunakan Midtrans

---

## Technical Goals

- Menggunakan Next.js App Router
- Menggunakan React Server Component
- Menggunakan Server Action
- Menggunakan React 19
- Menggunakan Realtime Database
- Clean Architecture
- Full Typescript
- Production Ready

---

# 3. Target User

## Admin

Mengelola seluruh sistem.

Hak akses:

- User Management
- Menu Management
- Table Management
- Reporting
- Dashboard
- Role Management

---

## Cashier

Bertugas menerima pembayaran.

Hak akses:

- Order List
- Payment
- Print Receipt
- Transaction History

---

## Waiter

Bertugas menerima pesanan pelanggan.

Hak akses:

- Create Order
- Update Order
- Add Menu
- Table Reservation

---

## Kitchen

Bertugas menyiapkan makanan.

Hak akses:

- View Incoming Order
- Update Cooking Status

---

## Owner

Monitoring bisnis.

Hak akses:

- Dashboard
- Sales Report
- Revenue Report
- Popular Menu
- Employee Activity

---

# 4. User Flow

```
Login

↓

Dashboard

↓

Select Role

↓

Role Dashboard

↓

Create Order

↓

Kitchen Receive Order (Realtime)

↓

Kitchen Update Status

↓

Cashier Receive Notification

↓

Payment

↓

Receipt

↓

Completed
```

---

# 5. Functional Requirements

---

## Authentication

### Features

- Login
- Logout
- Protected Route
- Session Management
- Role Based Access

Technology

- Supabase Auth
- Server Action

---

## Dashboard

Features

- Statistics Card
- Today's Revenue
- Today's Orders
- Active Tables
- Reserved Tables
- Popular Menu
- Sales Chart

---

## User Management

CRUD User

Fields

- Full Name
- Email
- Password
- Avatar
- Role

Role

- Admin
- Cashier
- Waiter
- Kitchen
- Owner

---

## Menu Management

CRUD Menu

Fields

- Image
- Menu Name
- Category
- Price
- Stock
- Description
- Available Status

---

## Category Management

CRUD Category

Fields

- Category Name

---

## Table Management

CRUD Table

Fields

- Table Number
- Capacity
- Status

Status

- Available
- Reserved
- Occupied

---

## Order Management

Features

Create Order

Order Detail

Cart

Quantity

Notes

Discount

Tax

Service Fee

Split Bill (Future)

---

Order Status

Pending

Preparing

Ready

Completed

Cancelled

---

## Kitchen Dashboard

Realtime Incoming Order

Realtime Status

Cooking Timer

Completed Notification

---

## Cart

Features

Add Item

Remove Item

Update Quantity

Order Notes

Subtotal

Tax

Discount

Grand Total

---

## Payment

Payment Method

Cash

QRIS

Credit Card

Virtual Account

E-Wallet

Technology

Midtrans Snap

---

## Reporting

Sales Today

Sales Monthly

Sales Yearly

Revenue

Popular Menu

Best Employee

Order Count

Cancelled Order

---

# 6. Non Functional Requirements

Performance

- Response < 500 ms

Availability

- 99%

Security

- Authentication
- Authorization
- RLS Supabase
- Environment Variables

Scalability

- Multi Restaurant Ready

Responsive

- Desktop
- Tablet
- Mobile

---

# 7. Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI

---

## State Management

- Zustand

---

## Server State

- TanStack React Query

---

## Form

- React Hook Form
- Zod

---

## Database

- PostgreSQL
- Supabase

---

## Authentication

- Supabase Auth

---

## Storage

- Supabase Storage

---

## Payment

- Midtrans

---

## Deployment

- Vercel

---

# 8. Database Module

Core Tables

```
users

profiles

roles

categories

menus

tables

orders

order_items

payments

payment_transactions

reservations

activity_logs
```

---

# 9. Folder Structure

```
src/

app/

components/

features/

hooks/

actions/

services/

repositories/

schemas/

types/

stores/

constants/

lib/

utils/

providers/

middleware.ts
```

---

# 10. Realtime Features

Supabase Realtime

Realtime Event

- New Order
- Update Order Status
- Payment Success
- Table Status
- Kitchen Notification
- Reservation Update

---

# 11. UI Pages

Authentication

- Login

Dashboard

Admin

Cashier

Kitchen

Owner

Waiter

Master Data

Users

Menus

Categories

Tables

Transaction

Orders

Payment

Receipt

Reports

Settings

Profile

---

# 12. Milestones

## Phase 1

- Authentication
- Dashboard
- User Management
- Menu Management
- Category Management
- Table Management

---

## Phase 2

- Order Management
- Cart
- Kitchen Dashboard
- Realtime Order

---

## Phase 3

- Midtrans
- Payment
- Receipt

---

## Phase 4

- Reporting
- Charts
- Analytics

---

## Phase 5

- Deployment
- Performance Optimization
- SEO
- Security Hardening

---

# 13. Future Enhancements

- Multi Branch Restaurant
- Customer Membership
- Loyalty Point
- Voucher System
- Promo Management
- Inventory Management
- Purchase Order
- Supplier Management
- Kitchen Display System (KDS)
- Barcode Scanner
- QR Menu
- Customer Self Ordering
- Split Bill
- Multi Payment
- Refund
- Offline Mode (PWA)
- Push Notification
- Mobile App (React Native)
- AI Sales Prediction
- AI Menu Recommendation
- Export Excel & PDF
- Audit Log
- Activity Monitoring

---

# 14. Success Metrics (KPIs)

| Metric                    | Target    |
| ------------------------- | --------- |
| Login Success Rate        | >99%      |
| Order Creation Time       | <10 detik |
| Payment Processing        | <5 detik  |
| Realtime Update Delay     | <1 detik  |
| Lighthouse Performance    | >90       |
| Lighthouse Accessibility  | >90       |
| Lighthouse Best Practices | >95       |
| Lighthouse SEO            | >90       |

---

# 15. Learning Objectives

Melalui proyek ini, tujuan pembelajaran bukan hanya menghasilkan aplikasi POS, tetapi juga menguasai praktik pengembangan aplikasi modern yang siap digunakan di industri. Setelah proyek selesai, diharapkan mampu:

- Membangun aplikasi full-stack menggunakan Next.js 15 dan React 19.
- Memahami React Server Components, Server Actions, dan App Router.
- Mendesain database PostgreSQL menggunakan Supabase.
- Mengimplementasikan autentikasi dan otorisasi berbasis role.
- Mengelola state lokal dengan Zustand dan server state menggunakan TanStack React Query.
- Menerapkan validasi form menggunakan React Hook Form dan Zod.
- Membangun fitur realtime menggunakan Supabase Realtime.
- Mengintegrasikan payment gateway Midtrans.
- Menerapkan arsitektur aplikasi yang modular dan scalable.
- Melakukan deployment aplikasi ke Vercel dengan praktik produksi yang baik.

---
