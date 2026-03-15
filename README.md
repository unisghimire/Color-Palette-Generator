# Color Palette Generator

A React app to generate and explore color palettes. Lock colors you like, choose a harmony mode, and copy hex codes with one click.

## Features

- **Generate palettes** — New random palettes or harmony-based (complementary, analogous, triadic, tetradic, monochromatic).
- **4–8 colors** — Choose how many swatches to show (4, 5, 6, 7, or 8).
- **Lock colors** — Lock any swatch so it stays when you generate again.
- **Copy hex** — Click a color to copy its hex code; RGB is shown on hover.
- **WCAG contrast** — AA/AAA badge when a color has sufficient contrast for text.
- **Edit with HSL** — Open “Edit” on a swatch to fine-tune with Hue, Saturation, and Lightness sliders.
- **Export** — Copy the palette as CSS variables, SCSS variables, JSON, or a comma-separated hex list.
- **Save & load** — Save palettes (with a name) to browser storage and load or remove them later.
- **Keyboard** — Press **Space** to generate a new palette (when not focused on a control).
- **Responsive** — Works on desktop and mobile.

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for build and dev server
- CSS Modules for styling

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install and run

```bash
git clone https://github.com/YOUR_USERNAME/color-palette-generator.git
cd color-palette-generator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder. You can deploy it to [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com), or [Netlify](https://www.netlify.com).

### Scripts

| Command    | Description              |
| ---------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Type-check and build     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## License

MIT — see [LICENSE](LICENSE).
