# Vibe Todo

A modern, high-performance todo application built with a focus on aesthetics and user experience. "Vibe coded" for maximum productivity and visual appeal.

## 🚀 Features

- **Task Management**: Seamlessly add, edit, and manage your daily tasks.
- **Calendar Dashboard**: Track your productivity with daily success rates visualized on a calendar.
- **Premium UI**: Shiny components, smooth animations, and a polished interface.
- **Custom Themes**: Multiple color themes including Light, Dark, Kiwi, and more.
- **Secure Auth**: Robust JWT-based authentication system.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Neon](https://neon.tech/) (Postgres) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT (Bearer) using `jose`
- **Styling**: Vanilla CSS + Tailwind
- **Icons**: Lucide React

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd todo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

### 4. Database Setup
Push the schema to your database:
```bash
npm run db:push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run db:push`: Push Drizzle schema to database
- `npm run db:generate`: Generate migrations
- `npm run db:migrate`: Run migrations
