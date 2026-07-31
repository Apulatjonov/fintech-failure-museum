# Fintech Failure Museum

**Every financial disaster changed how the world builds money.**

An interactive digital museum exploring the biggest failures in fintech history through cinematic storytelling, elegant animations, and a museum-grade experience.

## Live

Designed to run on **GitHub Pages** (static only).

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript (ES Modules)
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Canvas-based subtle world map
- Zero framework, zero backend

## Features

- Cinematic full-screen hero with living background
- Animated statistics and loss counters
- Horizontal interactive timeline
- Masonry-style museum collection with filters
- Fullscreen incident “artifact” views
- Deep-dive scroll story (Knight Capital)
- Engineer Mode (architecture, order flow, sequence, hard lessons)
- Custom cursor, smooth physics-based interactions
- Museum Mode auto-scroll exhibition
- Surprise Me / Random Incident
- Fully responsive (redesigned for mobile, not just shrunk)

## Local Development

```bash
# Any static server
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Settings → Pages → Source: Deploy from a branch → `main` / root (or `/docs` if you prefer).
3. Your museum will be live at `https://<user>.github.io/<repo>/`.

## Design Language

Financial Times × Apple × Stripe.

Dark, editorial, luxurious, minimal. Huge typography, deliberate whitespace, calm cinematic pacing.

## Credits

Built by Abdulaziz Pulatjonov.

Open source. Study the failures. Build better systems.
