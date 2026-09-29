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
  const colorInputId = useId();
  const hexId = useId();

  const [hexDraft, setHexDraft] = useState(toPickerHex(currentColor));
  const [recentColor, setRecentColor] = useState<string | null>(readRecentColor);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerWrapRef = useRef<HTMLDivElement>(null);

  const pickerHex = toPickerHex(currentColor);

  useEffect(() => {
    if (!open) {
      setPickerOpen(false);
      return;
    }
    setHexDraft(toPickerHex(currentColor));
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
    setHexDraft(next);
    dispatch(changeThemeColor({ color: next }));
  };

  const applyCustom = (raw: string) => {
    const next = normalizeHex(raw);
    if (!next) return;
    setHexDraft(next);
    setRecentColor(next);
    writeRecentColor(next);
    dispatch(changeThemeColor({ color: next }));
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
                        setHexDraft(pickerHex);
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
                          Pick a color
                        </p>
                        <label
                          htmlFor={colorInputId}
                          className="br24-theme-picker-spectrum"
                          style={{ backgroundColor: toPickerHex(hexDraft) }}
                        >
                          <input
                            id={colorInputId}
                            type="color"
                            className="br24-theme-picker-input"
                            value={toPickerHex(hexDraft)}
                            aria-label="Color spectrum"
                            onChange={(e) => applyCustom(e.target.value)}
                          />
                        </label>
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
                              setHexDraft(normalized);
                              applyCustom(normalized);
                            } else {
                              setHexDraft(pickerHex);
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
