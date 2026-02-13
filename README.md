# Career Compass AI

An AI-powered web app that provides students with personalized career suggestions, skill recommendations, and actionable advice based on their academic profile and interests.

## Features

- **Personalized Recommendations:** Input your interests, degree, CGPA, and career goal to receive tailored career suggestions.
- **Skill Suggestions:** Get a list of relevant skills to learn for your chosen path.
- **AI Advice:** Receive a short, actionable paragraph of guidance.
- **Modern UI:** Clean, mobile-responsive, and user-friendly interface built with React, Vite, and shadcn/ui components.
- **Supabase Integration:** Uses Supabase Edge Functions and Lovable AI (Gemini) for backend intelligence.

## Demo

![screenshot](public/screenshot.png) <!-- Add a screenshot if available -->

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or bun

### Installation
```bash
git clone https://github.com/your-username/career-compass-ai.git
cd career-compass-ai
npm install
# or
bun install
```

### Development
```bash
npm run dev
# or
bun run dev
```
The app will be available at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
```

### Lint & Test
```bash
npm run lint
npm run test
```

## Project Structure

- `src/` — Main source code
	- `pages/` — Main pages (Index.tsx, NotFound.tsx)
	- `components/` — UI components (shadcn/ui)
	- `integrations/supabase/` — Supabase client and types
	- `lib/` — Utilities
- `supabase/functions/` — Edge functions (career-advisor)
- `public/` — Static assets

## How It Works

1. **User Input:** Students fill out a form with their interests, degree, CGPA, and career goal.
2. **AI Processing:** The frontend calls a Supabase Edge Function, which invokes Lovable AI (Gemini) to generate recommendations.
3. **Results:** The app displays three career suggestions, a list of skills, and a personalized advice paragraph.

## Environment Variables

Create a `.env` file in the project root with the following:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

For Supabase Edge Functions, set the `LOVABLE_API_KEY` in your Supabase project environment.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Lovable AI (Gemini)](https://lovable.ai/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

## License

MIT
