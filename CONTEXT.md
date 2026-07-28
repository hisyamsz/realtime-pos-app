# Domain Context & Architecture (`realtime-pos-app`)

## Overview
`realtime-pos-app` is a modern Real-Time Point of Sale (POS) application built with **Next.js (App Router)**, **React**, **TypeScript**, **Supabase (Auth & Database)**, **Tailwind CSS**, **Shadcn UI**, and integrated with **Midtrans Payment Gateway**.

## Architectural Graph & Abstractions (via Graphify)

Based on the codebase knowledge graph (`graphify-out/GRAPH_REPORT.md`):

### Core God Nodes & Utilities
- `cn()` — Primary class name merging utility (`src/lib/utils.ts`) used across all UI components.
- `createClient()` — Supabase client factory for Auth, Middleware, and Database connections.
- Core Shadcn UI Primitives: `Button()`, `Input()`, `Form()`, `Sidebar()`, `Dialog()`.

### Key Architectural Modules & Communities
1. **Authentication & Supabase Server Actions**:
   - Manages user login/logout (`loginAction()`, `logoutAction()`), user creation/deletion, and Supabase auth middleware.
2. **User Administration & Dialog Validation**:
   - Admin user management dialogs (`DialogCreateUser`, `DialogUpdateUser`, `DialogDelete`), custom user form components.
3. **POS & Payment Gateway Integration**:
   - Point of Sale transaction flow integrated with Midtrans payment processing.
4. **Form Controls & File Uploads**:
   - Reusable form primitives (`FormInput`, `FormSelect`, `FormImage`, `PasswordInput`) powered by `react-hook-form` and `@hookform/resolvers`.
5. **Layout & Navigation System**:
   - App Sidebar (`AppSidebar`), Dashboard Layout (`DashboardLayoutProps`), Breadcrumb navigation, and dark mode provider (`next-themes`).
6. **Design System & Styling**:
   - Soft Cloud Dark Mode tokens, Nike design system core foundations, PostCSS & Tailwind configuration.

## Domain Model & Glossary

### Core Entities
- **Menu Item (`menus`)**: Items offered in the POS system (food/beverages). Key attributes: `name`, `description`, `price`, `discount`, `image_url`, `category` (text category), and `is_available` status.

## Agent Guidelines
- Always refer to `CONTEXT.md` for overall architecture context when adding new features or components.
- Check `docs/adr/` before introducing breaking architectural or pattern changes.
- Track feature tasks and tickets using local markdown files in `.scratch/<feature>/`.

