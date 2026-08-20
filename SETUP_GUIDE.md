# 🚀 Complete Setup & Customization Guide

Welcome to the **Padel Club & Sports Booking System Template**! This guide covers everything you need to get your website running, customize it for your brand, and deploy it to production.

---

## 📑 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Quick Start (Zero Config Mode)](#-quick-start-zero-config-mode)
3. [Full Database Setup (Neon PostgreSQL)](#-full-database-setup-neon-postgresql)
4. [How to Customize Your Website](#-how-to-customize-your-website)
5. [Admin Dashboard Guide](#-admin-dashboard-guide)
6. [Deployment to Vercel](#-deployment-to-vercel)

---

## 📦 Prerequisites

Make sure you have installed:
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v22.x LTS`)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

Check your Node version:
```bash
node -v
```

---

## ⚡ Quick Start (Zero Config Mode)

This template includes a built-in **LocalStorage Fallback**. You can run the entire site, including the booking flow and admin dashboard, without setting up a database first!

```bash
# 1. Clone or extract the project folder
cd padelLp

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser at `http://localhost:5173`. That's it! 🎉

---

## 🗄️ Full Database Setup (Neon PostgreSQL)

If you want persistent, real-time database storage across all users:

### Step 1: Create a Free Database
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project (e.g. `padel-club-db`).
3. In your Neon Dashboard, go to **SQL Editor**.

### Step 2: Run Database Schema
1. Open the file `schema.sql` from this project.
2. Copy all the contents and paste them into the Neon SQL Editor.
3. Click **Run** to create all tables and insert initial demo data.

### Step 3: Configure `.env`
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In your Neon Dashboard, copy the **Connection string** (Pooled or Direct).
3. Paste it inside `.env`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require"
   ```
4. Restart your development server (`npm run dev`). The app will now automatically connect to your live database!

---

## 🎨 How to Customize Your Website

### 1. Brand, Contact Info, & Social Media (Central Config)
Open `src/lib/config/site.ts`. You can change everything here in one place:
```typescript
export const siteConfig = {
    name: "Your Sports Club",
    contact: {
        phone: "+62 812-0000-0000",
        email: "hello@yourclub.com",
        address: "123 Sport Street, Your City",
        whatsappUrl: "https://wa.me/6281200000000",
    },
    hours: {
        weekday: "06:00 - 22:00",
        weekend: "06:00 - 23:00",
    },
    social: {
        instagram: "https://instagram.com/yourprofile",
        facebook: "https://facebook.com/yourprofile",
        tiktok: "https://tiktok.com/@yourprofile",
    }
};
```

### 2. Multi-Language & Text Content
Open `src/lib/stores/language.ts`. You can edit all Indonesian (ID) and English (EN) texts for:
- Hero headlines & subtitles
- About section stats & descriptions
- Services & Program descriptions
- Testimonials & FAQs
- Membership plans & CTA banners

### 3. Replace Logos & Images
- **Logos**: Replace `static/images/logos/padel-light.svg` and `padel-dark.svg` with your brand logos.
- **Hero & Backgrounds**: Replace images inside `static/images/images/`.
- **Courts & Lessons**: Replace photos in `static/images/images/`.

### 4. Adjust Colors & Styling
This template uses **Tailwind CSS v4**. Custom styles and theme definitions are located in `src/routes/layout.css` and can be customized with standard Tailwind utility classes.

---

## 🛠️ Admin Dashboard Guide

- Open `http://localhost:5173/admin` in your browser.
- **Features included**:
  - **Overview Analytics**: Real-time revenue charts (ApexCharts), active bookings, member counts.
  - **Bookings Management**: View reservations, change statuses (`Paid`, `Pending`, `Cancelled`), and delete entries.
  - **Courts Manager**: Add new courts, edit pricing, or toggle availability.
  - **Membership Plans**: Customize tier names, prices, features, and highlight badges.
  - **Newsletter List**: View and export subscriber emails.

---

## 🚀 Deployment to Vercel

The easiest way to deploy this SvelteKit application is using [Vercel](https://vercel.com):

1. Push your codebase to GitHub, GitLab, or Bitbucket.
2. Go to **Vercel Dashboard** $\rightarrow$ **Add New Project** $\rightarrow$ Import your repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your live PostgreSQL/Neon connection string.
4. Click **Deploy**.
5. Your website is live with automatic SSL, global CDN, and serverless edge functions!

---

## 💬 Support & License

For questions, issues, or custom feature requests, feel free to reach out via your Gumroad receipt or email us at `info@padelclub.com`.

Enjoy building with this template! 🎾✨
