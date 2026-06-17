# Premium photobook platform — full tech stack & skill set (A to Z)

A complete reference for building a fully customizable photobook platform with a lightweight, modern, luxury-feeling UI, plus an admin panel that handles orders, PDFs, and every other business operation end to end.

---

## 1. Design philosophy: how to avoid the "default AI website" look

Most AI-generated or template-driven sites share the same tells: purple-to-blue gradient heroes, glassmorphism cards, generic rounded "blob" illustrations, Inter font with no real hierarchy, oversaturated neon accents, and carousel-stuffed hero sections. A premium, lightweight brand avoids all of this through restraint, not extra effects.

| Avoid | Aim for instead |
|---|---|
| Purple/blue gradient backgrounds | Flat, neutral surfaces (cream, white, charcoal) |
| Glassmorphism / heavy blur cards | Thin 0.5px borders, no blur, no shadow |
| Generic 3D blob illustrations | Real photography or simple geometric shapes |
| One default sans-serif everywhere | A serif + sans pairing used deliberately |
| 5+ accent colors | 2–3 muted colors, used consistently |
| Heavy drop shadows, glow effects | Flat fills, shadows only for functional focus states |
| Carousel-heavy hero sections | One strong static hero, scroll-based reveals instead |
| Dense, cluttered layouts | Generous whitespace, one focal point per section |

### Exact brand palette

Extracted directly from the brand reference image — a monochromatic blush rose theme. Use only these shades on the frontend, no additional accent colors.

| Token | Hex | Use |
|---|---|---|
| Blush 50 | `#FEF6F7` | Page background, lightest highlight |
| Blush 100 | `#F0DADD` | Card and section surfaces |
| Blush 200 | `#E5BDC5` | Primary brand color — buttons, key accents, hero elements |
| Blush 400 | `#D8B2B9` | Borders, dividers, secondary surfaces |
| Blush 600 | `#B08F95` | Muted text, icons, secondary labels |
| Blush 900 | `#86636A` | Headlines, primary body text, ink color (used instead of black) |

**Skills this requires on the design side:**
- Typography systems (pairing a serif for editorial moments with a clean sans for UI/body text, and defining a strict type scale)
- Restrained color theory (building a 2–3 color palette with proper light/dark tonal ramps, not picking random hex codes)
- Motion/micro-interaction design (subtle hover states, scroll reveals, smooth transitions — used sparingly, not everywhere)
- Editorial layout / whitespace discipline (knowing when *not* to add an element)
- Basic photography direction (since a photobook brand lives or dies by how photos are presented)

---

## 2. Frontend stack & skills

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js + React + TypeScript | SSR for SEO on marketing pages, client rendering for the editor |
| Styling | Tailwind CSS with a custom design token config | Fast to build, but only looks premium if you override the default theme (colors, spacing, font) rather than using defaults |
| Canvas editor | Fabric.js or Konva.js | Powers the drag, resize, rotate, layer behavior of the design editor |
| State management | Zustand | Tracks the editor's frequently-changing canvas state |
| Data fetching | TanStack Query | Caching and loading states for templates, orders, pricing |
| Animation | Framer Motion (used minimally) | Scroll reveals and hover micro-interactions, not full-page effects |
| Image handling | next/image, Sharp (server-side) | Lazy loading, responsive sizing, compression |

**Skills needed:** React/TypeScript fundamentals, canvas/graphics programming (this is the hardest frontend skill on the list — most developers haven't built a drag-and-drop canvas editor before), performance budgeting (Lighthouse scores, bundle size discipline so "lightweight" stays true), responsive/mobile layout, basic accessibility (WCAG contrast and keyboard nav).

---

## 3. Backend stack & skills

| Layer | Technology | Why |
|---|---|---|
| Runtime/framework | Node.js + NestJS + TypeScript | Structured, testable codebase as the project grows |
| API style | REST | Sufficient for this scope; GraphQL adds complexity not needed here |
| Background jobs | BullMQ + Redis | Runs PDF generation, image processing, and emails asynchronously |
| PDF generation | Puppeteer (headless render) + pdf-lib (post-processing) | Converts the editor's design data into a high-resolution, bleed-and-trim-correct print file |
| Image processing | Sharp | Resizing, format conversion, compression of every uploaded photo |
| Auth | JWT with refresh tokens | Separate customer and admin roles enforced at the API level |

**Skills needed:** Node.js/TypeScript backend development, queue-based/async job design, PDF and print-production concepts (DPI, bleed, trim marks, CMYK color), API security fundamentals.

---

## 4. Data layer

| Layer | Technology | Why |
|---|---|---|
| Primary database | PostgreSQL + Prisma ORM | Users, orders, pricing rules, project metadata |
| Cache / queue store | Redis | Backs BullMQ and caches pricing calculations |
| Object storage | AWS S3 or Cloudflare R2 | Uploaded photos and generated PDFs (R2 avoids egress fees) |
| CDN | Cloudflare or CloudFront | Fast image delivery globally |

**Skills needed:** Relational database design, ORM usage (Prisma), basic cloud storage and CDN configuration.

---

## 5. Payments & security

- **Payment gateway:** Razorpay (UPI, cards, netbanking — ideal for an India-based customer base), with server-side webhook confirmation rather than trusting client-side redirects.
- **Input validation:** Zod schemas on every API endpoint.
- **Security hygiene:** Helmet for HTTP headers, rate limiting on public endpoints, HTTPS everywhere, dependency vulnerability scanning.
- **Compliance note:** never handle raw card data directly — let the hosted payment gateway checkout handle it, this keeps you out of PCI-DSS scope.

**Skills needed:** Payment gateway integration and webhook handling, basic application security practices.

---

## 6. Infrastructure & DevOps

| Layer | Technology | Why |
|---|---|---|
| Containers | Docker | Consistent environment from dev to production |
| Hosting (early stage) | Render or Railway | Lower ops overhead than raw AWS for a first launch |
| Hosting (at scale) | AWS ECS/Fargate or small Kubernetes setup | Migrate once traffic and team size justify it |
| CI/CD | GitHub Actions | Automated tests and deploys on merge |

**Skills needed:** Docker basics, CI/CD pipeline setup, light cloud infrastructure management.

---

## 7. Testing & monitoring

- **Unit/integration tests:** Jest or Vitest
- **End-to-end tests:** Playwright, covering the two flows that cannot break — finishing a design in the editor, and completing checkout
- **Error tracking:** Sentry (frontend and backend)
- **Uptime/metrics:** Grafana + Prometheus, or a simpler hosted option like Better Stack
- **Transactional email:** Resend or AWS SES (order confirmations, invoices, password resets)

**Skills needed:** Test-writing discipline (especially e2e coverage on revenue-critical flows), basic observability setup.

---

## 8. Customer-facing customization engine (the "no limits" core)

This is the actual product. Every page is a free-form canvas, not a fixed form:

- **Layout:** start from a template or a blank page, drag, resize, rotate, and layer any element freely
- **Photos:** upload, crop, zoom, rotate, filters, opacity, drop shadow, z-index layering, low-resolution warnings before checkout
- **Text:** font family, size, color, alignment, spacing, basic effects, independent per text box
- **Backgrounds & themes:** solid colors, patterns, gradients, photo backgrounds, plus a premade theme library customers can still override
- **Book structure:** page count, paper type, cover type (hardcover, softcover, leather), separate design treatment for front cover, spine, and back cover
- **Autosave & resume:** project state saved continuously as structured JSON, so customers can leave and come back
- **Live preview:** flipbook-style preview before checkout

---

## 9. Admin panel feature set (A to Z)

**Orders**
- List, search, and filter by status, customer, or date
- View full order detail, including the locked design snapshot
- Download the print-ready PDF (high-res, CMYK, bleed/trim marks) per order
- Update order status: pending → in production → printed → shipped → delivered
- Handle cancellations and refunds, with the gateway's refund API wired in

**Customers**
- Customer list with order history
- Support notes per customer
- Guest checkout records alongside registered accounts

**Templates & content**
- CRUD for templates, themes, and layout presets — addable without a developer
- Asset library management (fonts, stock backgrounds, clip art)
- Homepage content management (featured styles, banners, announcements)

**Pricing**
- CRUD for pricing rules: base price by size, per-page price, cover type price, paper type price, add-ons
- Promo code management

**Operations**
- Role-based access (admin, staff, support — not everyone needs full access)
- Inventory tracking for paper/cover stock, if you manage physical materials yourself
- Audit log of admin actions (who changed what pricing rule, when)

**Analytics**
- Revenue over time
- Orders by status, by template, by region
- Conversion funnel: started a design → finished a design → checked out

---

## 10. Suggested team / roles if hiring

- **Frontend developer** — React/Next.js, with prior canvas/graphics-editor experience if possible, this is the hardest role to fill well
- **Backend developer** — Node.js/NestJS, comfortable with async job queues and PDF/print concepts
- **UI/UX designer** — editorial or luxury-brand design background, not generic SaaS dashboard experience
- **DevOps** — part-time/contract is usually enough at this stage
- **QA** — at least light e2e test coverage before launch, even if it's one person part-time

---

## 11. Build order (so nothing has to be rebuilt later)

1. Auth + basic template catalog
2. The design editor (hardest part, build and stabilize the JSON data format first)
3. Pricing engine + checkout + payments
4. Admin panel + order management
5. PDF generation pipeline, built against the now-stable design JSON
6. Testing, monitoring, polish, launch
