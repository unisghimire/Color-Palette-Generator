/**
 * Converts HSL to hex. S and L are 0–100.
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  const r = Math.round(f(0) * 255)
  const g = Math.round(f(8) * 255)
  const b = Math.round(f(4) * 255)
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/** Parse hex to r, g, b in 0–255. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** Convert hex to HSL (h 0–360, s and l 0–100). */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
        break
      case gn:
        h = ((bn - rn) / d + 2) / 6
        break
      default:
        h = ((rn - gn) / d + 4) / 6
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

/** Relative luminance (0–1) for contrast. */
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (c: number) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG contrast ratio (1–21). */
export function getContrastRatio(foreground: string, background: string): number {
  const L1 = getLuminance(foreground)
  const L2 = getLuminance(background)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Format as "rgb(r, g, b)". */
export function formatRgb(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Random hue in [0, 360).
 */
function randomHue(): number {
  return Math.floor(Math.random() * 360)
}

/**
 * Generates a random color with optional saturation/lightness bounds.
 */
export function randomColor(
  sMin = 50,
  sMax = 85,
  lMin = 45,
  lMax = 65
): string {
  const h = randomHue()
  const s = sMin + Math.random() * (sMax - sMin)
  const l = lMin + Math.random() * (lMax - lMin)
  return hslToHex(h, s, l)
}

/**
 * Generates harmony-based colors from a base hue.
 */
export function harmonyColors(baseHue: number, mode: string, count: number): string[] {
  const s = 60 + Math.random() * 25
  const l = 45 + Math.random() * 20
  const hues: number[] = []

  switch (mode) {
    case 'complementary': {
      hues.push(baseHue, (baseHue + 180) % 360)
      break
    }
    case 'analogous': {
      const step = 30
      for (let i = -1; i <= 1; i++) hues.push((baseHue + i * step + 360) % 360)
      break
    }
    case 'triadic': {
      hues.push(baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360)
      break
    }
    case 'tetradic': {
      hues.push(baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360)
      break
    }
    case 'monochromatic': {
      const spread = 25
      for (let i = 0; i < count; i++) {
        hues.push((baseHue + (i - count / 2) * (spread / count) + 360) % 360)
      }
      break
    }
    default: {
      for (let i = 0; i < count; i++) hues.push((baseHue + (i * 360) / count) % 360)
    }
  }

  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const h = hues[i % hues.length] ?? baseHue
    const lAdj = l + (Math.random() - 0.5) * 10
    const sAdj = s + (Math.random() - 0.5) * 10
    result.push(hslToHex(h, Math.max(20, Math.min(95, sAdj)), Math.max(30, Math.min(75, lAdj))))
  }
  return result
}
