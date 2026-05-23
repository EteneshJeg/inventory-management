# Inventory Management System

A clean, full-stack inventory management web app built with Next.js. Add, edit, delete, and search products with image uploads, category filtering, and real-time stock tracking.

## Features

- **Full CRUD** — create, read, update, and delete inventory items
- **Image uploads** — product images stored on Cloudinary
- **Search & filter** — search by name or category, filter by category pills
- **Sort** — sort by newest, name, price, or quantity
- **Stock indicators** — automatic In Stock / Low Stock / Out of Stock badges
- **Dark mode** — toggle between light and dark theme, persists across sessions
- **Responsive** — works on mobile, tablet, and desktop

## Tech Stack

- **Framework** — Next.js (App Router)
- **Database** — Neon PostgreSQL + Drizzle ORM
- **Storage** — Cloudinary (image uploads)
- **Styling** — Tailwind CSS
- **Deployment** — Vercel

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root with the following:

```env
DATABASE_URL=your_neon_database_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Push the database schema:

```bash
npx drizzle-kit push
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
