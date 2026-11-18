# FixMate Client — Rules for the AI agent

## Project

Next.js (App Router, JavaScript, NOT TypeScript), Tailwind CSS, shadcn/ui, BetterAuth,
sonner (toasts), lucide-react (icons), recharts (charts).
The Express API is at process.env.NEXT_PUBLIC_API_URL. Always call it with apiFetch() from
lib/api.js.

## Coding style (I am a beginner, keep it simple and readable)- Write simple, beginner friendly code. No advanced patterns, no clever one-liners, no extra

abstractions.- One component per file. If a file gets longer than ~150 lines, split it into smaller components.- Use clear names: bookings, handleCancel, isLoading. No single-letter variables.- Put a short plain-English comment above every function saying what it does.- Every API call uses async/await inside try/catch and shows a sonner toast on success and on error.- Use shadcn/ui components + Tailwind classes only. Do not add other UI libraries.- Use plain <img> tags for service images (images come from external URLs).- Folders: pages in app/, reusable UI in components/ (shared/ and dashboard/), helpers in lib/.- Status colors come from STATUS_STYLES in lib/constants.js. Use <StatusBadge /> everywhere.- Never hardcode secrets or URLs. Use process.env.- Keep the same heading style, button style, card style and spacing on every page.

## Design system

Primary navy #0B1F3A, accent orange #F97316, background #F8FAFC, white cards, rounded-xl, shadow-sm.
Container: max-w-7xl mx-auto px-4. Section spacing: py-16. All cards in a grid have equal height.

## Do NOT touch (unless I ask): lib/auth.js, lib/api.js, lib/guards.js, middleware.js, app/api/\*

## When you finish a task: list every file you created or changed. Do not run git commit.
