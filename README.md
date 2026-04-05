<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1r0-IGDhL-cHmpJH4iv_QmPIM92RQkGi0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Project Structure

```
college_tech_club/
├── index.html                  # HTML entry point (Tailwind CDN, Google Fonts, import map)
├── index.tsx                   # React entry point (ReactDOM, BrowserRouter, StrictMode)
├── App.tsx                     # Main app with routing (Home, Resources, CP Roadmap, Blog2Code)
├── vite.config.ts              # Vite config (React plugin, port 3000, path aliases)
├── tsconfig.json               # TypeScript config (ES2022, react-jsx, bundler resolution)
├── package.json                # Dependencies: React 19, react-router-dom 7, lucide-react
├── metadata.json               # AI Studio app metadata
├── types.ts                    # TypeScript interfaces (Article, Category)
├── main.py                     # FastAPI backend for Blog2Code feature
├── .gitignore                  # Standard ignores (node_modules, dist, *.local)
│
├── components/
│   ├── Navbar.tsx              # Fixed top navigation bar with branding and links
│   ├── Hero.tsx                # Full-viewport hero section with decorative cards
│   ├── FeaturedBlogs.tsx       # 4-column grid of featured blog cards
│   ├── UpcomingEvents.tsx      # Events section with hero card and smaller cards
│   ├── OurTracks.tsx           # Category cards (CP, ML, Dev, Research) with navigation
│   ├── DevelopmentResources.tsx # Dev resources page with tech stack modals & learning links
│   ├── CPRoadmap.tsx           # Competitive Programming roadmap with DSA flowchart
│   ├── Blog2CodePage.tsx       # ML-powered Blog-to-Code converter UI
│   ├── SubscriptionBanner.tsx  # Yellow CTA section for newsletter subscription
│   └── Footer.tsx              # Simple footer with links and copyright
│
└── src/                        # Placeholder directories (unused, components live in components/)
    ├── components/
    │   └── layout/
    └── types/
```

### Architecture

- **Frontend**: React 19 + TypeScript + Vite with React Router (4 routes), Tailwind CSS (CDN), and lucide-react icons
- **Backend**: FastAPI (`main.py`) for the Blog2Code AI feature — runs a 4-step LLM pipeline to transform technical blog posts into full code repositories
- **Key Features**: Featured blogs, upcoming events, tech tracks (CP, ML, Dev, Research), development resources with learning roadmaps, and a Blog-to-Code converter
