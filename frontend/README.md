# Timelyx Frontend

React + Vite client for Timelyx lecture hall management.

## Stack

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `VITE_API_BASE_URL` (default: `http://localhost:3000`)

## Available Scripts

- `npm run dev` - run development server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Auth and OAuth Flow

- Local login/signup via `/users/login` and `/users`
- Google and Microsoft OAuth starts from backend redirect endpoints
- Frontend callback route: `/oauth/callback`

## Main Directories

- `src/pages/` - route pages
- `src/components/` - reusable components
- `src/layouts/` - role-specific layouts
- `src/services/` - API service layer
- `src/context/` - auth/theme contexts

## Styling

- Tailwind CSS with dark mode support via `ThemeContext`.
