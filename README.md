# Paolo Enrera: Portfolio

My personal portfolio site: an animated, editorial-style single page that presents my work, skills and process, with a working contact form. It's built with Next.js and TypeScript and exported as a static site.

**[🌐 View the live site](https://paolojansenenrera-78fcb.web.app)**

![Portfolio screenshot](public/images/Premium%20Portfolio.jpg)

---

## Highlights

- **Motion with restraint:** text reveals, a drawn-on headline, a WebGL grid distortion (Three.js), a tile-shimmer background, smooth scrolling (Lenis) and scroll-triggered timelines (GSAP). Animations tone down for visitors who turn on `prefers-reduced-motion`.
- **Light and dark themes:** design tokens switch with the theme (`next-themes`), and the footer zone stays dark in both.
- **Contact form without a backend:** messages are sent through EmailJS from the browser, so the site stays fully static.
- **Fast static hosting:** `next build` exports static files that Firebase Hosting serves, and the images are recompressed for production.
- **Accessible interactions:** the project modal traps focus and closes on Esc, the navigation tracks the active section, and the menus work from the keyboard.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui primitives, class-variance-authority |
| Motion | Framer Motion, GSAP, Lenis, Three.js |
| Email | EmailJS |
| Hosting | Firebase Hosting |

## Project structure

```
src/
  app/                  routes: / (home) and /contact
  components/
    sections/           Hero, Intro/Bio, Mission, Selected Work, Skills, Process, Contact
    layout/             Navbar, full-screen nav overlay, footer, theme provider
    reactbits/          animated text and canvas effects
    ui/                 buttons, tags, marquee, theme toggle
  hooks/                reduced motion, in-viewport, active section, Lenis, magnetic hover
  lib/                  section registry, utilities
```

## Run it locally

Requires Node.js 20+.

```bash
git clone https://github.com/shuu-pao/Portfolio-Page.git
cd Portfolio-Page
npm install
cp .env.local.example .env.local   # optional: add EmailJS keys for the contact form
npm run dev                         # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Static production build |
| `npm run lint` | Run ESLint |

### Environment variables

The contact form needs three EmailJS values in `.env.local`. Everything else works without them.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Template using `user_name`, `user_email`, `user_message` |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |

## Deploy

```bash
npm run build
firebase deploy
```

## About the author

**Paolo Jansen Enrera**, Software Engineering Associate at Accenture and BS Computer Engineering graduate of the University of San Carlos, Cebu. I build web and mobile apps as personal projects.

[LinkedIn](https://www.linkedin.com/in/paolo-jansen-enrera/) · [GitHub](https://github.com/shuu-pao)
