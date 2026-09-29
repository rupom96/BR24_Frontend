import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { FiMoon, FiSun } from 'react-icons/fi';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Tooltip } from '@mui/material';

import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import { falsifyThemeSettings } from '../../application/Redux/slices/ThemeSettingsSlice';
import {
  darkenCurrentMode,
  lightenCurrentMode,
} from '../../application/Redux/slices/CurrentModeSlice';
import { changeThemeColor } from '../../application/Redux/slices/CurrentColorSlice';

const themeColors = [
  { name: 'Teal', color: '#0d9488' },
  { name: 'Cyan', color: '#03C9D7' },
  { name: 'Blue', color: '#1A97F5' },
  { name: 'Indigo', color: '#1c64f2' },
  { name: 'Purple', color: '#7352FF' },
  { name: 'Rose', color: '#FF5C8E' },
  { name: 'Orange', color: '#FB9678' },
];

const RECENT_COLOR_KEY = 'colorModeRecent';

function normalizeHex(value: string): string | null {
  let v = value.trim();
  if (!v) return null;
  if (!v.startsWith('#')) v = `#${v}`;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(v)) return null;
  return `#${v.slice(1).toLowerCase()}`;
}

function toPickerHex(value: string): string {
  return normalizeHex(value) ?? '#0d9488';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = toPickerHex(hex).slice(1);
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

function clampChannel(value: string): number | null {
  if (value.trim() === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function readRecentColor(): string | null {
  try {
    return normalizeHex(localStorage.getItem(RECENT_COLOR_KEY) || '');
  } catch {
    return null;
  }
}

function writeRecentColor(color: string) {
  try {
    localStorage.setItem(RECENT_COLOR_KEY, color);
  } catch {
    /* ignore */
  }
}

const ThemeSettings = () => {
  const reduceMotion = useReducedMotion();
  const open = useAppSelector((state) => state.themeSettings.bool);
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();
  const isDark = currentMode === 'Dark';
  const hexId = useId();
  const rId = useId();
  const gId = useId();
  const bId = useId();

  const [hexDraft, setHexDraft] = useState(toPickerHex(currentColor));
  const [rgbDraft, setRgbDraft] = useState(() => hexToRgb(currentColor));
  const [hsvDraft, setHsvDraft] = useState(() => {
    const rgb = hexToRgb(currentColor);
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
  });
  const [recentColor, setRecentColor] = useState<string | null>(readRecentColor);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerWrapRef = useRef<HTMLDivElement>(null);
  const svBoardRef = useRef<HTMLDivElement>(null);

  const pickerHex = toPickerHex(currentColor);
  const hueColor = `hsl(${hsvDraft.h}, 100%, 50%)`;

  const syncDrafts = (hex: string) => {
    const next = toPickerHex(hex);
    const rgb = hexToRgb(next);
    setHexDraft(next);
    setRgbDraft(rgb);
    setHsvDraft(rgbToHsv(rgb.r, rgb.g, rgb.b));
  };

  useEffect(() => {
    if (!open) {
      setPickerOpen(false);
      return;
    }
    syncDrafts(currentColor);
    setRecentColor(readRecentColor());
  }, [open, currentColor]);

  useEffect(() => {
    if (!pickerOpen) return undefined;

    const onPointerDown = (e: MouseEvent) => {
      if (!pickerWrapRef.current?.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  const close = () => dispatch(falsifyThemeSettings());

  const applyPreset = (raw: string) => {
    const next = normalizeHex(raw);
    if (!next) return;
    setPickerOpen(false);
    syncDrafts(next);
    dispatch(changeThemeColor({ color: next }));
  };

  const applyCustom = (
    raw: string,
    hsvOverride?: { h: number; s: number; v: number }
  ) => {
    const next = normalizeHex(raw);
    if (!next) return;
    const rgb = hexToRgb(next);
    setHexDraft(next);
    setRgbDraft(rgb);
    setHsvDraft(hsvOverride ?? rgbToHsv(rgb.r, rgb.g, rgb.b));
    setRecentColor(next);
    writeRecentColor(next);
    dispatch(changeThemeColor({ color: next }));
  };

  const commitHsv = (next: { h: number; s: number; v: number }) => {
    const rgb = hsvToRgb(next.h, next.s, next.v);
    applyCustom(rgbToHex(rgb.r, rgb.g, rgb.b), next);
  };

  const pickFromSvBoard = (clientX: number, clientY: number) => {
    const el = svBoardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    commitHsv({ ...hsvDraft, s, v });
  };

  const onRgbChange = (channel: 'r' | 'g' | 'b', raw: string) => {
    const channelValue = clampChannel(raw);
    if (channelValue === null) return;
    const updated = { ...rgbDraft, [channel]: channelValue };
    setRgbDraft(updated);
    applyCustom(rgbToHex(updated.r, updated.g, updated.b));
  };

  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 34 };

  const swatchMotion = (index: number) => ({
    initial: reduceMotion ? false : { scale: 0.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      delay: reduceMotion ? 0 : 0.04 * index,
      type: 'spring' as const,
      stiffness: 420,
      damping: 24,
    },
    whileHover: reduceMotion ? undefined : { scale: 1.12 },
    whileTap: reduceMotion ? undefined : { scale: 0.94 },
  });

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="br24-theme-backdrop"
            className="br24-theme-backdrop"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={close}
            role="presentation"
          />

          <motion.aside
            key="br24-theme-panel"
            className={`br24-theme-panel ${isDark ? 'dark' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="br24-theme-settings-title"
            initial={reduceMotion ? false : { x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="br24-theme-panel-header">
              <div>
                <p className="br24-theme-kicker">Appearance</p>
                <h2 id="br24-theme-settings-title" className="br24-theme-title">
                  Theme Settings
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close theme settings"
                onClick={close}
                className="br24-theme-close"
              >
                <MdOutlineCancel />
              </button>
            </div>

            <div className="br24-theme-section">
              <p className="br24-theme-section-label">Mode</p>
              <div
                className="br24-theme-mode-toggle"
                role="group"
                aria-label="Color mode"
              >
                <button
                  type="button"
                  className={`br24-theme-mode-btn ${
                    currentMode === 'Light' ? 'is-active' : ''
                  }`}
                  onClick={() => dispatch(lightenCurrentMode())}
                  style={
                    currentMode === 'Light'
                      ? { backgroundColor: currentColor, color: '#fff' }
                      : undefined
                  }
                >
                  <FiSun />
                  Light
                </button>
                <button
                  type="button"
                  className={`br24-theme-mode-btn ${
                    currentMode === 'Dark' ? 'is-active' : ''
                  }`}
                  onClick={() => dispatch(darkenCurrentMode())}
                  style={
                    currentMode === 'Dark'
                      ? { backgroundColor: currentColor, color: '#fff' }
                      : undefined
                  }
                >
                  <FiMoon />
                  Dark
                </button>
              </div>
            </div>

            <div className="br24-theme-section">
              <p className="br24-theme-section-label">Accent color</p>
              <p className="br24-theme-section-hint">
                Presets, custom picker, or your recent color — applies across
                the app, including login.
              </p>

              <div className="br24-theme-swatches">
                {themeColors.map((item, index) => {
                  const selected = item.color.toLowerCase() === pickerHex;
                  return (
                    <Tooltip
                      key={item.color}
                      title={item.name}
                      placement="top"
                      arrow
                    >
                      <motion.button
                        type="button"
                        aria-label={item.name}
                        aria-pressed={selected}
                        className={`br24-theme-swatch ${
                          selected ? 'is-selected' : ''
                        }`}
                        style={{ backgroundColor: item.color }}
                        {...swatchMotion(index)}
                        onClick={() => applyPreset(item.color)}
                      >
                        <AnimatePresence>
                          {selected && (
                            <motion.span
                              className="br24-theme-swatch-check"
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <BsCheck />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </Tooltip>
                  );
                })}

                {recentColor && (
                  <Tooltip title="Recent" placement="top" arrow>
                    <motion.button
                      type="button"
                      aria-label="Recent color"
                      aria-pressed={recentColor === pickerHex}
                      className={`br24-theme-swatch ${
                        recentColor === pickerHex ? 'is-selected' : ''
                      }`}
                      style={{ backgroundColor: recentColor }}
                      {...swatchMotion(themeColors.length)}
                      onClick={() => {
                        setPickerOpen(false);
                        applyCustom(recentColor);
                      }}
                    >
                      <AnimatePresence>
                        {recentColor === pickerHex && (
                          <motion.span
                            className="br24-theme-swatch-check"
                            initial={reduceMotion ? false : { scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <BsCheck />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </Tooltip>
                )}

                <div className="br24-theme-picker-anchor" ref={pickerWrapRef}>
                  <Tooltip title="Custom color" placement="top" arrow>
                    <motion.button
                      type="button"
                      aria-label="Open custom color picker"
                      aria-expanded={pickerOpen}
                      aria-haspopup="dialog"
                      className={`br24-theme-swatch br24-theme-swatch-custom ${
                        pickerOpen ? 'is-open' : ''
                      }`}
                      {...swatchMotion(themeColors.length + 1)}
                      onClick={() => {
                        syncDrafts(pickerHex);
                        setPickerOpen((v) => !v);
                      }}
                    >
                      <span className="br24-theme-swatch-custom-orbit" aria-hidden>
                        <span className="br24-theme-swatch-custom-ring" />
                        <span className="br24-theme-swatch-custom-core">
                          <span className="br24-theme-swatch-custom-plus" />
                        </span>
                      </span>
                    </motion.button>
                  </Tooltip>

                  <AnimatePresence>
                    {pickerOpen && (
                      <motion.div
                        className="br24-theme-picker-popover"
                        role="dialog"
                        aria-label="Custom color picker"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 8, scale: 0.96 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: reduceMotion ? 0 : 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="br24-theme-picker-popover-title">
                          Custom color
                        </p>

                        <div
                          ref={svBoardRef}
                          className="br24-theme-picker-sv"
                          style={{ backgroundColor: hueColor }}
                          role="slider"
                          tabIndex={0}
                          aria-label="Saturation and brightness"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(hsvDraft.s * 100)}
                          onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId);
                            pickFromSvBoard(e.clientX, e.clientY);
                          }}
                          onPointerMove={(e) => {
                            if (!e.currentTarget.hasPointerCapture(e.pointerId))
                              return;
                            pickFromSvBoard(e.clientX, e.clientY);
                          }}
                        >
                          <span
                            className="br24-theme-picker-sv-thumb"
                            style={{
                              left: `${hsvDraft.s * 100}%`,
                              top: `${(1 - hsvDraft.v) * 100}%`,
                              backgroundColor: toPickerHex(hexDraft),
                            }}
                          />
                        </div>

                        <label className="br24-theme-picker-hue">
                          <span className="br24-theme-picker-label">Hue</span>
                          <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={Math.round(hsvDraft.h)}
                            aria-label="Hue"
                            className="br24-theme-picker-hue-input"
                            onChange={(e) =>
                              commitHsv({
                                ...hsvDraft,
                                h: Number(e.target.value),
                              })
                            }
                          />
                        </label>

                        <div className="br24-theme-picker-rgb">
                          {(
                            [
                              ['r', rId, 'R'],
                              ['g', gId, 'G'],
                              ['b', bId, 'B'],
                            ] as const
                          ).map(([channel, id, label]) => (
                            <label
                              key={channel}
                              htmlFor={id}
                              className="br24-theme-picker-channel"
                            >
                              <span>{label}</span>
                              <input
                                id={id}
                                type="number"
                                min={0}
                                max={255}
                                inputMode="numeric"
                                className="br24-theme-picker-channel-input"
                                value={rgbDraft[channel]}
                                onChange={(e) =>
                                  onRgbChange(channel, e.target.value)
                                }
                              />
                            </label>
                          ))}
                        </div>
                        <label
                          htmlFor={hexId}
                          className="br24-theme-picker-label"
                        >
                          Hex
                        </label>
                        <input
                          id={hexId}
                          type="text"
                          spellCheck={false}
                          autoComplete="off"
                          className="br24-theme-picker-hex"
                          value={hexDraft}
                          placeholder="#0d9488"
                          maxLength={7}
                          onChange={(e) => {
                            const next = e.target.value;
                            setHexDraft(next);
                            const normalized = normalizeHex(next);
                            if (normalized) applyCustom(normalized);
                          }}
                          onBlur={() => {
                            const normalized = normalizeHex(hexDraft);
                            if (normalized) {
                              applyCustom(normalized);
                            } else {
                              syncDrafts(pickerHex);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                              setPickerOpen(false);
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="br24-theme-preview">
              <span
                className="br24-theme-preview-dot"
                style={{ backgroundColor: currentColor }}
              />
              <div>
                <p className="br24-theme-preview-label">Active accent</p>
                <p className="br24-theme-preview-value">{currentColor}</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ThemeSettings;
