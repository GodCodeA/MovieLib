# MovieLib

A small frontend application for quick movie recommendations: random movie, genre collections, and top 9.

## Features
- Recommends a random movie
- Shows top 9 movies
- Genre collections and movie detail page
- Search movies by title

## Quick start

Requires Node.js and npm.

> If you register and then have trouble signing in, enable third-party cookies in your browser settings. This app may require them for authentication to work correctly.

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project structure
- `src/` — React + TypeScript source files
- `src/pages` — pages (Home, Genres, Movie, Profile, etc.)
- `src/components` — reusable components (modals, search, trailer)
- `src/api` — backend API methods
- `src/styles` — global styles

## Live demo
- https://movielib.pages.dev

## API
The project uses `https://cinemaguide.skillbox.cc` as the `baseURL` (see `src/api/http.ts`). If you need to change the API address, update `src/api/http.ts`.

## Deployment
Cloudflare is recommended — connect the repository, set the build command to `npm run build`, and publish the `dist` folder.

## Add an About page (optional)
You can render `README.md` inside the app using `react-markdown` and create a `/about` route.

## Contribution
If you want to improve the UI or functionality, create a branch and open a PR. Open an issue for discussion.

## License
MIT — use and modify as needed.

