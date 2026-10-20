# K.N. Lawn — Premium Wedding & Event Venue Platform

Official digital presence, celebration portfolio, availability schedule, customer enquiry system, and owner-controlled administration portal for **K.N. Lawn** (Rae Bareli, Uttar Pradesh, India).

---

## 1. Visual Identity & Design System

The application is styled with an authentic Indian luxury hospitality palette:
- **Forest Green**: `#183D32`
- **Deep Green**: `#102820`
- **Champagne Gold**: `#C6A66B` (Accent `#DFC493`)
- **Warm Ivory Canvas**: `#F8F5EF`
- **Charcoal Typography**: `#292D29`
- **Headings Font**: *Playfair Display*
- **Body & Controls Font**: *Plus Jakarta Sans*

---

## 2. Key Pages & Routes

### A. Public Website
- `/`: **Home Page** — Cinematic hero with high-impact wedding lawn photography, value proposition, quick booking strip, venue story excerpt, event categories (Weddings, Receptions, Sangeet, Engagements), featured gallery albums, configurable venue highlights, interactive date availability calendar, verified location card with Google Maps embed, and direct call/WhatsApp actions.
- `/about`: **About Venue** — Story of K.N. Lawn, sprawling grounds overview, full list of owner-configured facilities, and on-site walk-through scheduling.
- `/events`: **Events & Gallery** — Filterable photo albums by celebration category (`wedding`, `reception`, `engagement`, `anniversary`, `celebration`), search by title/keywords, and album cards.
- `/events/:slug`: **Event Album Detail** — Dedicated event view with guest counts, ceremony narrative, photo grid, and full-screen **Lightbox** viewer with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape`).
- `/availability`: **Availability Calendar** — Interactive monthly calendar with accessible status indicators (`Available`, `Booked / Blocked`, `Pending Confirmation`), date selection, and instant booking initiation.
- `/enquire`: **Booking Enquiry Form** — Validated form (Indian mobile number regex `+91 / 10-digits`, date validation preventing past or unavailable dates, event type, guest count, customer message, required consent checkbox). Upon submission, generates an enquiry reference (e.g. `KNL-2026-4821`), confirmation screen, and direct WhatsApp/call buttons.
- `/contact`: **Contact & Directions** — Direct phone (`tel:`), WhatsApp (`wa.me`), email (`mailto:`), visiting hours, message submission form, and embedded Google Map with driving directions link based on verified K.N. Lawn coordinates (26.2340154, 81.2308606).

### B. Owner Administration Portal (`/admin/*`)
- `/admin/login`: Protected login page with demo auto-fill credentials helper (`admin@knlawn.com` / `admin123`), show/hide password toggle, and validation.
- `/admin/dashboard`: Summary metrics (New enquiries, In discussion, Blocked dates, Live albums), quick actions, recent customer enquiries table, and upcoming scheduled events.
- `/admin/events`: Event management table, publish/draft toggle, search, and delete with confirmation dialog.
- `/admin/events/new` & `/admin/events/:id/edit`: Album creator/editor with title, slug, category, date, guest count, description, cover photo selection, and local photo upload preview via `FileReader`.
- `/admin/availability`: Calendar schedule manager supporting date ranges, status changes (`Available`, `Unavailable`, `Pending`), private internal notes, and **real-time date-overlap conflict warnings**.
- `/admin/enquiries`: Searchable and filterable enquiry list (`new`, `contacted`, `pending`, `confirmed`, `rejected`, `cancelled`). Review customer requirements, trigger direct WhatsApp/call/email, edit internal admin notes, and **automatically lock dates on the calendar upon confirmation**.
- `/admin/settings`: Manage lawn name, address, owner contact numbers, Google Maps URLs, business hours, hero copy, and configurable facilities, plus a "Reset Demo Data" action.

---

## 3. Technology Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **React Router Dom v7**
- **Lucide React** icons

---

## 4. Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application runs on `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## 5. Prototype State vs. Future Backend Extension

### What Works Fully in This Frontend:
1. **Interactive Routing & Deep Linking**: Direct navigation between all public pages and admin sections.
2. **Availability Calendar & Booking Conflict Engine**: Automatic overlap detection preventing double-booking of confirmed dates.
3. **Form Validation**: Strict validation for Indian 10-digit mobile numbers, past date prevention, and blocked-date checks.
4. **Interactive Gallery & Lightbox**: Full-screen photo viewer with keyboard shortcuts and responsive grid.
5. **Admin Workflow**: Event CRUD, draft/published toggling, enquiry status management, calendar blocking, and site settings.
6. **Reactive Mock Data Store**: Changes in admin immediately reflect across public pages and persist in browser storage.
7. **Graceful Photo Upload Preview**: Photo attachments preview immediately in the browser without broken image frames.

### What Connects in Future Full-Stack Backend Integration:
- **Persistent Cloud Database**: Replace browser data service with PostgreSQL or Firestore.
- **Server-Authoritative Authentication**: Secure JWT/session cookies, password hashing (bcrypt/argon2), and role-based permissions (RBAC).
- **Cloud Media Storage**: Direct uploads to S3/Cloud Storage for high-resolution photography.
- **Transactional Booking Locks**: Atomic database transactions ensuring zero race conditions during peak auspicious muhurats.
- **SMS & Email Notifications**: Automatic WhatsApp/SMS/Email notifications to both the owner and prospective customer upon enquiry submission.
