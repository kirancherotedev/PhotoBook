# Build prompt — premium photobook customization platform

Use this as a direct instruction set for an AI coding agent (Claude Code, Cursor, etc.) or as a brief for a development team. It consolidates everything from `photobook-platform-tech-stack.md` into one actionable prompt. If anything here is ambiguous, treat that file as the canonical reference.

---

## Instruction to the builder

You are building a production-ready, full-stack web application for a custom photobook business. Customers design their own photobook with complete creative freedom — layouts, photos, text, covers, paper — and place an order. Admins manage every order, download print-ready PDFs, and control templates and pricing without touching code.

Do not default to generic AI-generated UI patterns. Specifically forbidden: purple-to-blue gradient hero backgrounds, glassmorphism/blurred cards, generic 3D blob illustrations, a single default sans-serif font with no hierarchy, oversaturated neon accents, heavy drop shadows or glow effects, and carousel-stuffed hero sections. The brand must read as premium, minimal, and editorial — closer to a high-end print studio's site than a SaaS dashboard template.

---

## Non-negotiable design rules

- Flat surfaces only. Thin 0.5px borders for separation. No blur, no glow, no heavy shadows.
- Use this exact palette, extracted directly from the brand reference image, monochromatic blush rose. Do not introduce other accent colors.

| Token | Hex | Use |
|---|---|---|
| Blush 50 | `#FEF6F7` | Page background, lightest highlight |
| Blush 100 | `#F0DADD` | Card and section surfaces |
| Blush 200 | `#E5BDC5` | Primary brand color — buttons, key accents, hero elements |
| Blush 400 | `#D8B2B9` | Borders, dividers, secondary surfaces |
| Blush 600 | `#B08F95` | Muted text, icons, secondary labels |
| Blush 900 | `#86636A` | Headlines, primary body text, ink color |

This is a tonal, monochromatic palette by design — depth comes from the light/dark range of one hue, not from adding more colors. Use `#86636A` for all primary text on light backgrounds rather than pure black, it keeps the warm tone consistent. Reserve pure white (`#FFFFFF`) only for product photography backgrounds where true neutrality matters (e.g. behind an uploaded customer photo in the editor), not for page chrome.
- A serif typeface for a handful of editorial moments (hero headline, key callouts) paired with a clean sans-serif for everything else. Strict, limited type scale — not five different font sizes per page.
- Generous whitespace. One clear focal point per section, not multiple competing elements.
- Motion is allowed but minimal: subtle hover states and scroll-based reveals, never full-page animated effects or auto-playing carousels.
- Every interactive element should feel native and fast — performance is part of the premium feel, not separate from it.

---

## Required tech stack

Use exactly this stack unless a substitution is explicitly approved:

**Frontend:** Next.js, React, TypeScript, Tailwind CSS with a fully custom design token config (override the default theme, do not ship default Tailwind colors/spacing), Fabric.js or Konva.js for the canvas-based design editor, Zustand for editor state, TanStack Query for data fetching, Framer Motion used sparingly for micro-interactions only.

**Backend:** Node.js, NestJS, TypeScript, REST API, BullMQ with Redis for background jobs (PDF generation, image processing, email sending), Puppeteer for headless rendering of the print PDF, pdf-lib for bleed/trim/post-processing, Sharp for image optimization, JWT-based auth with refresh tokens and separate customer/admin roles.

**Data layer:** PostgreSQL with Prisma ORM as the source of truth, Redis as cache and job queue store, S3-compatible object storage (AWS S3 or Cloudflare R2) for photos and generated PDFs, a CDN in front of that storage (Cloudflare or CloudFront).

**Payments:** Razorpay integration covering UPI, cards, and netbanking. Confirm payment via server-side webhook — never trust a client-side redirect as proof of payment.

**Infra:** Docker for all services. Deploy to Render or Railway for the first production launch; design the app so it can migrate to AWS ECS/Fargate or Kubernetes later without a rewrite. GitHub Actions for CI/CD.

**Quality:** Jest or Vitest for unit tests, Playwright for end-to-end tests covering the design editor flow and checkout flow specifically, Sentry for error tracking, Zod for request validation on every endpoint, Helmet and rate limiting on the API.

---

## Core data model

At minimum, implement these entities and relationships:

- `User` — customer or admin, with role
- `Project` — one per book a customer is designing; stores `design_data` as structured JSON (pages, each with positioned elements: photos, text, backgrounds), plus status (draft, locked)
- `Template` — starting layouts and themes, admin-managed
- `Order` — references a `Project`, has status (pending, in_production, printed, shipped, delivered, cancelled, refunded), and a locked snapshot of the design data at time of payment
- `OrderItem` — line items contributing to the order total (base price, per-page cost, cover type, paper type, add-ons)
- `Payment` — gateway reference, status, linked to one order
- `PricingRule` — admin-editable rates for size, page count, cover type, paper type, and add-ons

The `design_data` JSON schema is the most important contract in the system: the editor writes it, the pricing engine reads parts of it, and the PDF renderer consumes the whole thing. Lock this schema early and keep the editor and PDF renderer in sync with it.

---

## Required customer-facing features

Build the design editor as a free-form canvas, not a fixed-slot form:

- Start from a template or a blank page; drag, resize, rotate, and layer any element freely, no fixed slots
- Photo tools: upload, crop, zoom, rotate, filters, opacity, drop shadow, z-index layering; warn the customer if an uploaded photo is too low-resolution for the size they've placed it at
- Text tools: font, size, color, alignment, spacing, independently per text box
- Backgrounds and themes: solid colors, patterns, photo backgrounds, plus a theme library the customer can still fully override
- Book structure controls: page count, paper type, cover type (hardcover/softcover/leather), separate design treatment for front cover, spine, and back cover
- Autosave continuously to the `design_data` JSON; support save-and-resume
- Live, flipbook-style preview before checkout
- Dynamic price display that recalculates from the server (never the client) as the customer changes page count, cover, or paper

---

## Required checkout flow

Cart review (itemized price breakdown, link back into the editor) → shipping details (address, delivery speed, real shipping cost) → payment (Razorpay, webhook-confirmed) → order locked (snapshot `design_data` onto the `Order`, independent from the still-editable `Project`) → confirmation email with invoice.

---

## Required admin panel features

- Orders: list/search/filter by status, customer, date; view full order detail including the locked design snapshot; download the print-ready PDF (300dpi, CMYK, bleed and trim marks) per order; update order status through its full lifecycle; process cancellations and refunds
- Customers: list with order history and support notes
- Templates and content: CRUD for templates, themes, and layout presets without needing a deploy; manage homepage banners and featured styles
- Pricing: CRUD for all pricing rules and promo codes
- Roles: admin vs staff vs support, with access scoped accordingly
- Analytics: revenue over time, orders by status/template, and a basic funnel (started a design → finished a design → checked out)
- Audit log of admin actions on pricing and templates

---

## PDF generation requirement

Render the same `design_data` JSON that powers the editor through a server-side headless browser (Puppeteer) at full print resolution, then post-process with pdf-lib to add bleed margins, trim marks, and correct color handling. The editor's rendering and the PDF renderer must interpret the JSON identically — test this explicitly, since mismatches here are the most common failure mode in this type of system.

---

## Build sequence

1. Auth, database schema, and a basic template catalog
2. The design editor — get the canvas and `design_data` JSON schema stable before building anything downstream of it
3. Server-side pricing engine, cart, and checkout with Razorpay
4. Admin panel: orders, status management, template and pricing CRUD
5. PDF generation pipeline, built against the now-stable `design_data` schema
6. Testing (especially e2e on the editor and checkout flows), monitoring, performance pass, launch

---

## Definition of done

- A customer can build a book entirely freehand on the canvas, with no layout restrictions, and the price updates live and correctly from the server as they do
- Checkout only marks an order paid after a verified payment webhook, and the design is snapshotted at that moment
- An admin can find any order, download a correctly formatted print-ready PDF for it, and move it through every status
- Templates, themes, and pricing can all be changed by an admin with no code deploy
- The site loads fast and looks restrained: flat surfaces, one consistent type and color system, no gradients or default-template visual tells
