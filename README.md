# Review Triage

A design feedback tool for preview deployments. Inspect elements, leave comments, and track issues across deploys all in the browser.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. No backend or database; all data is mock data for demonstration.

## Features

- **Element inspector** — Toggle inspect mode, hover to highlight elements, click to open a popover with element info (tag, classes, CSS selector, source file) and a form to add comments with type and severity.
- **Review panel** — Side panel (drawer or floating) to browse comments by deploy version, filter by type (bug, suggestion, question), track resolution progress, and open "Fix with" links to external tools (Cursor, v0, Conductor, Replit).
- **Number badges** — Overlay badges on elements that have comments, with counts and hover previews.
- **Floating toolbar** — Quick toggles for inspect mode, badges, and the review panel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |

## Project structure

```
src/
├── app/                # Next.js App Router (layout, page, global styles)
├── components/
│   ├── comments/       # Comment cards, number badges, severity
│   ├── demo/           # Demo pricing page used as preview content
│   ├── inspector/      # Element inspection, hover overlay, comment form
│   ├── review-popover/ # Review panel (drawer/floating, filters, progress)
│   └── toolbar/        # Floating toolbar
├── hooks/              # Shared hooks (hotkeys, clipboard, viewport, etc.)
├── lib/                # Utilities
├── mock/               # Mock deploys, comments, and fix-with targets
├── types/              # Shared TypeScript types
└── ui/                 # UI primitives and icons (Base UI / ShadCN style)
```

## Tech stack

| Category | Library |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI primitives | [@base-ui/react](https://base-ui.com) |
| Animation | [Motion](https://motion.dev) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Compiler | [React Compiler](https://react.dev/learn/react-compiler) |
| Fonts | [Geist](https://vercel.com/font) via `next/font` |

