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

/** Lighten (amount > 0) or darken (amount < 0) a hex color. */
export function adjustHex(hex: string, amount: number): string {
  const raw = (hex || '').replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return hex || '#0d9488';
  }
  const n = parseInt(full, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
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
