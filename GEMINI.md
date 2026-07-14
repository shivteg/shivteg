# Shivteg Portfolio Website - Project Context & Instructions

## Overview
**Shivteg Portfolio** is a premium, dark-themed developer portfolio website custom-engineered for **Shivteg** — Student, Frontend Developer, and Creative Tech Creator. It highlights key metrics, projects, skills, and coding journey milestones, featuring interactive components like a cursor-reactive 3D code terminal and an integrated Authentication modal supporting live Supabase authentication with a simulated LocalStorage fallback.

## Tech Stack
- **Frontend Core:** HTML5 (Semantic tags), Vanilla CSS3 (Custom design system, flexbox, grid, transitions, animations), ES6+ JavaScript.
- **Dependencies:** [Vite](https://vitejs.dev/) for development server and bundling optimization.
- **Authentication & Database:** [Supabase](https://supabase.com/) client integration (loaded via v2 CDN script).

## Architecture & Features

### Core Layout
The application is structured as a responsive single-page application. Styling is driven by vanilla CSS using custom CSS variables (design tokens) defined in `:root` inside [style.css](file:///C:/Users/user/shivteg/style.css), creating a sleek black aesthetic (`#0a0a0a`) with glowing Amber Gold and Cyan accent highlights.

### Interactive Elements
- **3D Interactive Terminal:** The hero section features a code terminal component that tracks the mouse position (`mousemove`) inside [setupCodeTerminalAnimation()](file:///C:/Users/user/shivteg/script.js#L151-L178) to compute relative offsets and dynamically apply a 3D perspective rotation tilt.
- **Active Navigation Highlighting:** Scroll progress is tracked in [setupScrollEffects()](file:///C:/Users/user/shivteg/script.js#L109-L146) to automatically apply styling to active navigation links and adjust the transparency of the header navbar.
- **Mobile Drawer Menu:** Sidebar overlay and toggle handles are configured via [setupMobileMenu()](file:///C:/Users/user/shivteg/script.js#L35-L67) to ensure responsive compatibility.
- **Simulated Contact Form:** Located under [setupContactForm()](file:///C:/Users/user/shivteg/script.js#L72-L104), this function intercepts form submissions, provides UI success feedback, and clears fields.

### Authentication & Sessions
Managed within [setupAuthModal()](file:///C:/Users/user/shivteg/script.js#L183-L519):
- **Live Supabase Authentication:** Uses credentials defined in [SUPABASE_URL](file:///C:/Users/user/shivteg/script.js#L6) and [SUPABASE_ANON_KEY](file:///C:/Users/user/shivteg/script.js#L7) to register, authenticate, and sign out users.
- **LocalStorage Fallback:** If Supabase constants remain at their default values, the app automatically pivots to local state simulation, reading/writing mock users inside `localStorage` (`auth_session`, `auth_users`).
- **Session Restoration:** On initialization, [checkSession()](file:///C:/Users/user/shivteg/script.js#L209-L233) checks for active sessions to keep the user signed in across page reloads.

## Development Guidelines

- **Maintain Aesthetic System:** Always reuse design tokens from `:root` in [style.css](file:///C:/Users/user/shivteg/style.css) (such as `--color-primary` for amber gold and `--color-secondary` for cyan) to preserve the design theme.
- **Configuring Supabase:** In production, replace the placeholder credentials in [script.js](file:///C:/Users/user/shivteg/script.js#L6-L7) with your actual live project URL and anon public key.
- **Adding Projects:** Add new project entries into the `.websites-grid` container within [index.html](file:///C:/Users/user/shivteg/index.html#L226-L348).

## Key Files
- [index.html](file:///C:/Users/user/shivteg/index.html) – The main markup file, structuring sections, svg icons, auth modal, and Supabase client script.
- [style.css](file:///C:/Users/user/shivteg/style.css) – Design system variables, layout styles, glows, keyframes, transitions, and media queries.
- [script.js](file:///C:/Users/user/shivteg/script.js) – App behavior controls: terminal tilts, navigation highlighters, forms, and Supabase auth flows.
- [package.json](file:///C:/Users/user/shivteg/package.json) – Handles dependencies (Vite) and development environment commands.
- [README.md](file:///C:/Users/user/shivteg/README.md) – Portfolio project readme file.
