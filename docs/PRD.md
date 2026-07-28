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

Web-based POS app for cafes & restaurants. Realtime order, payment, kitchen monitoring, reporting via Supabase Realtime.

Role dashboards for Admin, Cashier, Kitchen Staff.

### 1.3 Problem Statement

Replace manual recording with fast, accurate, realtime digital system.

---

## 2. Goals

### 2.1 Business Goals

- Simplify restaurant ops
- Speed up transactions
- Reduce human error
- Simplify sales monitoring
- Online payments via Midtrans

### 2.2 Technical Goals

- Next.js App Router
- React Server Component
- Server Action
- React 19
- Supabase Realtime Database
- Clean Architecture
- Full TypeScript
- Production Ready

---

## 3. Target Users & Roles

### 3.1 Admin

**Deskripsi:** Manage full system.

**Hak Akses:**

- User Management
- Menu Management
- Table Management
- Reporting
- Dashboard
- Role Management

### 3.2 Cashier

**Deskripsi:** Process payments.

**Hak Akses:**

- Order List
- Payment
- Print Receipt
- Transaction History

### 3.3 Kitchen

**Deskripsi:** Prepare food orders.

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

- Stat Cards:
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
| Full Name | Full name                 |
| Email     | Login email               |
| Password  | Login password            |
| Avatar    | Profile picture           |
| Role      | Admin / Cashier / Kitchen |

### 5.4 Menu Management

**Operation:** CRUD Menu

**Fields:**

| Field            | Keterangan             |
| ---------------- | ---------------------- |
| Image            | Menu photo             |
| Menu Name        | Menu name              |
| Category         | FK Category Management |
| Price            | Item price             |
| Description      | Description            |
| Available Status | Availability status    |

### 5.5 Category Management

**Operation:** CRUD Category

**Fields:**

| Field         | Keterangan    |
| ------------- | ------------- |
| Category Name | Category name |

### 5.6 Table Management

**Operation:** CRUD Table

**Fields:**

| Field        | Keterangan                      |
| ------------ | ------------------------------- |
| Table Number | Table number                    |
| Capacity     | Seat capacity                   |
| Status       | Available / Reserved / Occupied |

### 5.7 Order Management

**Features:**

- Create Order
- Order Detail
- Cart
- Quantity
- Notes (per item)
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

| Table                  | Deskripsi                           |
| ---------------------- | ----------------------------------- |
| `users`                | Account data (Supabase Auth)        |
| `profiles`             | User profiles (name, avatar)        |
| `roles`                | Role list (Admin, Cashier, Kitchen) |
| `categories`           | Menu categories                     |
| `menus`                | Data menu makanan/minuman           |
| `tables`               | Table data                          |
| `orders`               | Order data                          |
| `order_items`          | Item details per order              |
| `payments`             | Payment data                        |
| `payment_transactions` | Payment transaction log             |
| `reservations`         | Table reservation data              |
| `activity_logs`        | Activity logs                       |

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

| Event                | Deskripsi                         |
| -------------------- | --------------------------------- |
| New Order            | New order notification to Kitchen |
| Update Order Status  | Status update (Preparing → Ready) |
| Payment Success      | Payment confirmation              |
| Table Status         | Realtime table status update      |
| Kitchen Notification | Kitchen to cashier notification   |
| Reservation Update   | Reservation status update         |

---

## 11. UI Pages

### 11.1 Authentication

- `/login` — Login Page

### 11.2 Dashboard

- `/admin` — Admin Dashboard
- `/cashier` — Cashier Dashboard
- `/kitchen` — Kitchen Dashboard

### 11.3 Master Data

- `/admin/users` — User Management
- `/admin/menus` — Menu Management
- `/admin/categories` — Category Management
- `/admin/tables` — Table Management

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

Build production-ready POS & master modern web stack:

- Full-stack Next.js 15 + React 19
- React Server Components, Server Actions, App Router
- PostgreSQL schema + Supabase
- Role-based auth (RBAC)
- State management: Zustand (local) + TanStack React Query (server)
- Form validation: React Hook Form + Zod
- Realtime features via Supabase Realtime
- Payment gateway via Midtrans
- Modular, scalable architecture
- Production deploy to Vercel

---
