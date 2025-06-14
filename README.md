# BlogWebsite

A production-ready, fullstack blogging platform built with Next.js (TypeScript), Tailwind CSS, Prisma ORM, NextAuth.js, and Supabase (PostgreSQL, Auth, Storage).

## Features
- User authentication (register, login, logout, JWT/session)
- Admin panel for managing users and posts
- User roles (user/admin)
- Blog post CRUD, images, tags/categories, rich text editor
- User management (block, delete, assign roles)
- Public blog with search/filter
- Comments, likes/upvotes
- User profile with posts/comments, profile pic, edit profile
- Responsive, SEO-friendly, dark/light theme
- Security best practices (XSS/CSRF prevention, input validation, secure passwords)
- Email notifications (registration, password reset)
- Moderation (approve/reject/remove posts/comments)

## Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, React Hook Form, React Query, NextAuth.js
- **Backend:** Next.js API routes, Prisma ORM, Supabase client
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth.js (Supabase adapter or custom JWT)
- **Storage:** Supabase Storage
- **Email:** Supabase or SendGrid

## Setup Instructions
1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your secrets (see below).
4. **Prisma setup:**
   ```sh
   npx prisma generate
   npx prisma migrate dev
   ```
5. **Run the development server:**
   ```sh
   npm run dev
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Environment Variables
- Never expose secrets in frontend code. Use environment variables for all keys.
- Example `.env.example`:
  ```env
  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.kdlwxtjtonjckrtaepdr.supabase.co:5432/postgres
  NEXTAUTH_SECRET=your_nextauth_secret
  NEXTAUTH_URL=http://localhost:3000
  SUPABASE_URL=https://db.kdlwxtjtonjckrtaepdr.supabase.co
  SUPABASE_ANON_KEY=your_supabase_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
  EMAIL_FROM=your@email.com
  ```

## Folder Structure
- `src/components/` - React components
- `src/pages/` - Next.js pages & API routes
- `src/pages/api/` - API endpoints
- `src/pages/admin/` - Admin dashboard
- `src/pages/auth/` - Auth pages
- `src/pages/post/` - Blog post pages
- `src/pages/profile/` - User profiles
- `src/pages/settings.tsx` - User settings
- `src/styles/` - Tailwind/global styles
- `src/utils/` - Utility functions
- `src/models/` - Prisma models/schemas
- `src/hooks/` - Custom React hooks

## Best Practices
- Use TypeScript everywhere
- Modular, maintainable code
- Document major functions/APIs
- Validate all inputs
- Secure passwords, hide sensitive keys

---

For detailed documentation, see code comments and the `/docs` folder (if present).
