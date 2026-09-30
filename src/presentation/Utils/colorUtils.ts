/** Parse #RGB / #RRGGBB to rgba(). Falls back to teal if invalid. */
export function hexToRgba(hex: string, alpha: number): string {
  const raw = (hex || '').replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(13, 148, 136, ${alpha})`;
  }
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseHexRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const raw = (hex || '').replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Relative luminance 0–1 (sRGB). */
export function relativeLuminance(hex: string): number {
  const rgb = parseHexRgb(hex);
  if (!rgb) return 0.4;
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(rgb.r) + 0.7152 * toLin(rgb.g) + 0.0722 * toLin(rgb.b);
}

/**
 * Text/icon color for accents used as backgrounds.
 * Light accents → dark ink; dark accents → soft white.
 */
export function onAccentColor(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? '#0f172a' : '#f8f9fb';
}

/** Lighten (amount > 0) or darken (amount < 0) a hex color. */
export function adjustHex(hex: string, amount: number): string {
  const rgb = parseHexRgb(hex);
  if (!rgb) return hex || '#0d9488';
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(rgb.r + amount);
  const g = clamp(rgb.g + amount);
  const b = clamp(rgb.b + amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** CSS custom-property bag for accent (stage/local scope or :root). */
export function accentCssVars(
  accent: string,
  isDark: boolean
): Record<string, string> {
  return {
    '--br24-accent': accent,
    '--br24-accent-hover': adjustHex(accent, -22),
    '--br24-accent-strong': adjustHex(accent, -40),
    '--br24-accent-soft-fill': adjustHex(accent, isDark ? 55 : 90),
    '--br24-accent-soft': hexToRgba(accent, isDark ? 0.16 : 0.12),
    '--br24-glow': hexToRgba(accent, isDark ? 0.28 : 0.22),
    '--br24-on-accent': onAccentColor(accent),
  };
}

/** Push accent tokens onto :root so CSS/Tailwind/MUI follow ThemeSettings. */
export function applyAccentCssVars(accent: string, isDark: boolean) {
  const root = document.documentElement;
  const vars = accentCssVars(accent, isDark);
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
