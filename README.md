# 📸 PhotoBook Studio — Premium Photobooks & Custom Polaroids

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma%20v7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Fabric.js](https://img.shields.io/badge/Fabric.js%20v7-FF6C37?style=for-the-badge&logo=javascript&logoColor=white)

<p align="center">
  <strong>A state-of-the-art web platform for creating interactive 3D photo albums, customized photobooks, vintage polaroids, and print-ready PDFs.</strong>
</p>

</div>

---

## ✨ Overview

**PhotoBook Studio** is an advanced, beautifully designed web application that redefines digital photo curation and custom printing. Combining a modern aesthetic with powerful canvas manipulation and 3D rendering, PhotoBook Studio allows users to design, customize, and preview photobooks and retro prints with an intuitive, fluid user experience.

Whether crafting a wedding memory book, a holiday scrapbook, or a set of vintage Polaroid prints, PhotoBook Studio delivers a seamless journey from uploading photos to exporting high-resolution, print-ready documents.

---

## 🚀 Key Features

- 🎨 **Interactive Studio Editor**: Powered by **Fabric.js v7**, offering a full-featured drag-and-drop canvas editor with customizable layouts, multi-layer text typography, image cropping, filters, and curated color themes.
- 📖 **3D Book Preview & Animations**: Realistic 3D page-flipping animations and dynamic shader-driven backgrounds powered by **Three.js** and **Framer Motion**, giving users a lifelike tactile preview of their creations.
- 🖨️ **Print-Ready PDF Export**: Client and server-side document generation using **PDF-Lib** to produce crisp, high-resolution, print-ready PDF files directly from user canvas designs.
- 🖼️ **Rich Product Catalog & Templates**: Extensive pre-built templates for Mini, Medium, and Large Photobooks, *Story of Us*, *Best Moments*, *Celebrations*, Custom Polaroids, Retro Rolls, and Picture Postcards.
- ⚡ **Premium UI/UX Design**: Modern glassmorphism accents, curated color palettes, dark mode aesthetics, and responsive layouts built with **Tailwind CSS v4**.
- 🔒 **Secure Authentication & Management**: Robust user authentication and project state management with auto-saving capabilities.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion 12](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), Custom WebGL Shaders |
| **Canvas & 3D Graphics** | [Fabric.js v7](https://fabricjs.com/), [Three.js](https://threejs.org/) |
| **State Management** | [Zustand v5](https://zustand-demo.pmnd.rs/), [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Database & ORM** | [Prisma v7](https://www.prisma.io/) with [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) |
| **Document Export** | [PDF-Lib](https://pdf-lib.js.org/) |
| **Security & Validation** | [Zod](https://zod.dev/), [Jose](https://github.com/panva/jose) (JWT), [BcryptJS](https://github.com/dcodeIO/bcrypt.js) |

---

## 📁 Project Structure

```text
PhotoBook/
├── photobook/
│   ├── prisma/
│   │   ├── migrations/         # Database migration history
│   │   ├── schema.prisma       # Prisma database schema definition
│   │   └── seed.ts             # Initial database seeding script
│   ├── public/
│   │   ├── hero-frames/        # Hero section animation frames
│   │   ├── hero-images/        # High-res landing page banners
│   │   ├── polaroids/          # Polaroid assets & overlays
│   │   └── products/           # Product catalog mockup images
│   ├── src/
│   │   ├── app/                # Next.js App Router pages & API routes
│   │   │   ├── api/            # Backend REST endpoints (export, projects, auth)
│   │   │   ├── editor/         # Interactive canvas editor studio
│   │   │   ├── login/          # User authentication
│   │   │   ├── my-projects/    # User project dashboard
│   │   │   ├── polaroids/      # Polaroid creation flow
│   │   │   ├── pricing/        # Pricing & plans page
│   │   │   └── templates/      # Template selection & preview
│   │   ├── components/         # Reusable UI & 3D components
│   │   │   ├── BookAnimation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ShaderBackground.tsx
│   │   ├── lib/                # Utilities, types, themes, and product definitions
│   │   └── store/              # Zustand state stores (editor-store.ts)
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚡ Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/kirancherotedev/PhotoBook.git
cd PhotoBook/photobook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup & Seeding
Initialize the local SQLite database and seed it with curated products, templates, and default configurations:
```bash
npm run db:setup
```

### 4. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore **PhotoBook Studio**.

---

## 📜 Available NPM Scripts

Inside the `photobook/` directory, you can run the following commands:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-module reloading at port `3000`. |
| `npm run build` | Creates an optimized production build of the application. |
| `npm run start` | Starts the production server (requires running `npm run build` first). |
| `npm run lint` | Runs ESLint to check for code quality and formatting errors. |
| `npm run db:setup` | Runs Prisma migrations and executes the database seed script. |
| `npm run db:studio` | Opens **Prisma Studio** in your browser to inspect and manage database records visually. |
| `npm run db:reset` | Resets the database, dropping all tables and re-applying migrations. |

---

## 🎨 Design System & Aesthetics

PhotoBook Studio is engineered with a focus on visual excellence and dynamic responsiveness:
- **Curated Color Palettes**: Tailored HSL color tokens for warm photobook themes, sleek dark modes, and vibrant accents.
- **Glassmorphism & Shadows**: Multi-layered backdrop blurs and subtle drop shadows create depth and hierarchy across modals and floating toolbars.
- **Micro-Animations**: Smooth button hovers, page transitions, and canvas feedback animations powered by Framer Motion.

---

## 📄 License & Credits

Designed and developed by **[Kiran Cherote](https://github.com/kirancherotedev)**.  
All rights reserved.