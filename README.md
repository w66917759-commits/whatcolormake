# Color Recipe Lab

Interactive color mixing recipes and classroom-friendly worksheet tools for [whatcolormake.com](https://whatcolormake.com).

The app is built with Next.js App Router. It includes:

- an interactive color mixing game
- recipe pages for common "what colors make..." questions
- printable worksheet support
- sitemap and robots metadata for the apex production domain

## Getting Started

Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Production

The canonical production host is:

```txt
https://whatcolormake.com
```

`www.whatcolormake.com` should redirect permanently to the apex host.
