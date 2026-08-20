# 🎾 Padel Club & Sports Booking System Template

> A modern, ultra-fast, and responsive **Landing Page, Booking System, and Admin Dashboard** built with **Svelte 5 (Runes), SvelteKit, Tailwind CSS v4, and PostgreSQL/Neon**.

![Padel Club Preview](https://raw.githubusercontent.com/placeholder-demo.png)

---

## ✨ Features Highlight

- ⚡ **Next-Gen Stack**: Powered by Svelte 5 (latest Runes syntax `$state`, `$derived`, `$props`), SvelteKit 2, and Tailwind CSS v4.
- 🌐 **Bilingual / Multi-Language (ID & EN)**: Instant seamless language switching powered by reactive stores.
- 📅 **Interactive Booking Flow (`/booking`)**: Multi-step court booking wizard with date picker, time slot selection, add-on options, and dynamic QR Code generation.
- 📊 **Comprehensive Admin Dashboard (`/admin`)**:
  - Revenue & booking performance analytics with interactive ApexCharts.
  - Court management (Add, update, and manage pricing/courts).
  - Booking status manager (Paid, Pending, Cancelled).
  - Membership tier and plan manager.
  - Newsletter subscriber database.
- 🎯 **Centralized Configuration (`src/lib/config/site.ts`)**: Rebrand in 60 seconds (Brand name, phone, WhatsApp, email, address, social media links).
- 🔄 **Hybrid Architecture (Zero Setup Fallback)**:
  - Works 100% out-of-the-box using local mock storage (`localStorage`).
  - Seamlessly upgrade to **Neon PostgreSQL** by setting `DATABASE_URL`.
- 📱 **100% Responsive & Pixel-Perfect**: Designed for mobile, tablet, and desktop with sleek dark/light accents and glassmorphism.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Optional)

1. Open your PostgreSQL / [Neon.tech](https://neon.tech) SQL Console.
2. Run the provided `schema.sql` script to create tables and seed demo data.
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Put your `DATABASE_URL` inside `.env`.

---

## 📁 Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components (Hero, About, Services, etc.)
│   │   ├── config/          # Central site configuration (site.ts)
│   │   ├── server/          # Server-only database connection & queries
│   │   ├── stores/          # Reactive stores (Language & State)
│   │   └── state.svelte.ts  # Svelte 5 Rune-based global states
│   └── routes/
│       ├── +page.svelte     # Main Landing Page
│       ├── booking/         # Court Booking Flow
│       ├── admin/           # Admin Dashboard & Sub-modules
│       ├── login/           # Authentication Login
│       └── profile/         # User Profile
├── static/                  # Static assets (images, logos, icons)
├── schema.sql               # Database migration & seed script
└── SETUP_GUIDE.md           # Step-by-step setup and customization guide
```

---

## 📖 Complete Documentation

For in-depth guides on branding customization, color themes, and Vercel deployment, please see [SETUP_GUIDE.md](SETUP_GUIDE.md).

---

## 📄 License

This template is protected under standard commercial license terms. You are free to customize and use it for your personal or client projects. Reselling or redistributing the source code as a template is strictly prohibited.
