# Movie Search — Routed React App

A movie-search learning project built with React and React Router. Search results link to a dedicated movie page with a shareable URL.

## What problem did I solve?

A search result is more useful when it has its own address. I built separate search and detail routes so a user can open a film, navigate back, or return directly to its detail page.

## What is included?

- A search form backed by OMDb.
- Result cards with links to movie details.
- A movie route using the IMDb identifier.
- Loading and error feedback, including a missing API key and titles without a poster.
- A link back to search from the movie page.
- A not-found route for unknown paths.

## How do I know my solution works?

Five automated tests exercise search results, blank input, opening a movie route, a failed detail request, and an unknown route. They mock OMDb responses rather than depend on live API availability. The production build passes. GitHub Actions repeats the tests and build for pushes and pull requests.

## Run locally

Requires Node.js 22, npm, and an [OMDb API key](https://www.omdbapi.com/apikey.aspx).

```bash
npm ci
cp .env.example .env.local
```

Set `REACT_APP_OMDB_API_KEY` in `.env.local`, then run:

```bash
npm start
npm test -- --watchAll=false --runInBand
npm run build
```

Open http://localhost:3000. Environment changes require a server restart.

## What I practiced

Component state, client-side routing, route parameters, asynchronous requests, and testing user-visible behavior. This is an earlier learning project, separate from my single-screen [Movie Finder](https://github.com/lucasrigonatto/movie-finder).

A frontend API key is visible in the browser bundle. API quotas, posters, and external availability depend on OMDb. A production static host must route unmatched application URLs to `index.html`. On GitHub Pages the router uses the project path from `homepage`. The app uses the existing Create React App toolchain.
