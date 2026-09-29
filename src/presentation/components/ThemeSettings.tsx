import { createPortal } from 'react-dom';
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

const ThemeSettings = () => {
  const reduceMotion = useReducedMotion();
  const open = useAppSelector((state) => state.themeSettings.bool);
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();
  const isDark = currentMode === 'Dark';

  const close = () => dispatch(falsifyThemeSettings());

  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 34 };

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
                Applies across the app, including login.
              </p>
              <div className="br24-theme-swatches">
                {themeColors.map((item, index) => {
                  const selected = item.color === currentColor;
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
                        initial={
                          reduceMotion ? false : { scale: 0.7, opacity: 0 }
                        }
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: reduceMotion ? 0 : 0.04 * index,
                          type: 'spring',
                          stiffness: 420,
                          damping: 24,
                        }}
                        whileHover={reduceMotion ? undefined : { scale: 1.12 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                        onClick={() =>
                          dispatch(changeThemeColor({ color: item.color }))
                        }
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
