# SalonBook Client
Live site: https://saloonbook-client.vercel.app

SalonBook is the responsive Next.js client for a role-based salon appointment booking platform.

## Important Features

- Public home, service browse, search, category filters, price sorting, and service details
- Better Auth credential and Google authentication
- Protected customer and administrator dashboards
- Appointment requests, cancellation, and Stripe payment redirects
- Profile management and image uploads
- Responsive navigation, toasts, loaders, and error states

## Technology Stack

Next.js, React, JavaScript, Tailwind CSS, Better Auth, and Stripe Checkout redirects.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

- `MONGODB_URI`
- `DB_NAME`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `CLIENT_URL`
- `IMGBB_API_KEY`
- `ADMIN_NAME` (only needed to create an administrator)
- `ADMIN_EMAIL` (only needed to create an administrator)
- `ADMIN_PASSWORD` (only needed to create an administrator; use a strong password)

To create the initial administrator, put the three `ADMIN_*` values in your local, untracked `.env` file and run:

```bash
npm run admin:create
```

Run this once from the client directory. The script creates the account using Better Auth password hashing and then assigns the administrator role. It refuses to modify an existing account. Never commit or share `.env`; `.env.example` contains variable names only.

## Live and Repository Links

- Live website: [salonbook](https://saloonbook-client.vercel.app)
- Server repository: https://github.com/suave-sajid/salonbook-server
- Client repository: https://github.com/suave-sajid/saloonbook-client
