# Movie Hub Project

Movie Hub is a React/Vite frontend for browsing movies, signing in, signing up, and managing cinema bookings.

## Project Structure

- `moviehub-frontend/` - frontend app built with React, React Router, and Tailwind CSS
- `moviehub-frontend/src/` - application source code
- `moviehub-frontend/src/components/` - reusable UI components
- `moviehub-frontend/src/pages/` - page-level components for routing
- `moviehub-frontend/src/routes/` - application routing configuration
- `moviehub-frontend/src/context/` - authentication and movie context providers
- `moviehub-frontend/src/api/` - API helper modules

## Getting Started

From the `moviehub-frontend/` directory:

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal, typically `http://localhost:3000/`.

## Notes

- Login and signup pages are handled by React Router routes (`/login`, `/signup`).
- The header navigation uses client-side routing to avoid broken anchor links.

