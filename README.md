# Library of Books Frontend

A modern Library Management dashboard built with Next.js App Router, React 19, and TypeScript.

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

```bash
cp .env.example .env
```

3. Start the dev server

```bash
npm run dev
```

## Notes

- This UI consumes the Golang REST API at `NEXT_PUBLIC_API_BASE_URL`.
- The backend only exposes read-only endpoints for `buku` (books). Management CRUD is implemented for book types (jenis), authors, and publishers.
- Users endpoints are not fully implemented in the backend; the UI expects `/admin/pegawai` CRUD routes.
