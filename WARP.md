# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 project using TypeScript, TailwindCSS v4, and Turbopack for development. The project follows the modern Next.js App Router architecture with the `/src` directory structure.

## Development Commands

### First Time Setup
```powershell
# Install dependencies
npm install

# Generate Prisma client and setup database
npx prisma generate
npx prisma db push
```

### Development Server
```powershell
npm run dev
```
- Runs the development server with Turbopack for faster builds
- Opens at http://localhost:3000
- Supports hot reloading and instant updates

### Database Management
```powershell
# View database in browser
npx prisma studio

# Reset database (if needed)
npx prisma db push --force-reset
```

### Build and Production
```powershell
# Build for production
npm run build

# Start production server
npm start
```

### Linting
```powershell
npm run lint
```
- Uses ESLint with Next.js TypeScript configuration
- Configured to ignore standard build directories (node_modules, .next, out, build)

## Architecture

### Directory Structure
- **`/src/app/`**: Next.js App Router pages and layouts
  - `layout.tsx`: Root layout with Geist font configuration and global styles
  - `page.tsx`: Homepage component
  - `globals.css`: Global styles with TailwindCSS imports and CSS custom properties

### Key Technologies
- **Next.js 15** with App Router
- **React 19** 
- **TypeScript 5** with strict mode enabled
- **TailwindCSS v4** using `@import "tailwindcss"` syntax
- **Turbopack** for development builds
- **Geist fonts** (Sans and Mono variants) from Google Fonts

### Configuration Files
- **`tsconfig.json`**: TypeScript configuration with path mapping (`@/*` → `./src/*`)
- **`next.config.ts`**: Next.js configuration (currently minimal)
- **`eslint.config.mjs`**: ESLint flat config with Next.js core web vitals and TypeScript rules
- **`postcss.config.mjs`**: PostCSS configuration for TailwindCSS v4

### Styling Architecture
- Uses TailwindCSS v4 with the new `@theme inline` directive
- CSS custom properties for theming (dark/light mode support)
- Geist font variables configured via Next.js font optimization

## Development Notes

### Font System
The project uses Next.js font optimization with Geist Sans and Geist Mono fonts, configured as CSS variables (`--font-geist-sans`, `--font-geist-mono`) for use throughout the application.

### Theming
Global theming is implemented using CSS custom properties with automatic dark mode support via `prefers-color-scheme: dark`.

### TypeScript Configuration
The project uses modern TypeScript with path mapping for cleaner imports. Use `@/` prefix for importing from the `src` directory.