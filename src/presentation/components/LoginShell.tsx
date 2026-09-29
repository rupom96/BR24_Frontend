import { ReactNode, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppSelector } from '../../application/Redux/store/store';
import { adjustHex, applyAccentCssVars } from '../Utils/colorUtils';

type LoginShellProps = {
  title: string;
  kicker?: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function LoginShell({
  title,
  kicker = 'Sign in',
  subtitle,
  children,
  footer,
}: LoginShellProps) {
  const reduceMotion = useReducedMotion();
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const isDark = currentMode === 'Dark';

  useEffect(() => {
    applyAccentCssVars(currentColor, isDark);
  }, [currentColor, isDark]);

  const fade = (delay = 0) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.45,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <div
      className={`br24-login-stage ${isDark ? 'dark' : 'light'}`}
      style={
        {
          '--br24-accent': currentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="br24-login-glow"
        style={{ top: '-12%', left: '-8%' }}
        aria-hidden
      />
      <div
        className="br24-login-glow"
        style={{ bottom: '-18%', right: '-10%', animationDelay: '2.5s' }}
        aria-hidden
      />

      <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:justify-center md:gap-16">
        <motion.div
          className="text-center md:w-1/2 md:text-left"
          {...fade(0)}
        >
          <p className="br24-login-brand mb-2 text-xs font-semibold uppercase tracking-[0.35em]">
            Bizness Roots
          </p>
          <h1 className="br24-login-title text-4xl font-semibold tracking-tight md:text-5xl">
            BR24
          </h1>
          <p className="br24-login-subtitle mt-3 max-w-md text-sm leading-relaxed md:text-base">
            {subtitle}
          </p>
        </motion.div>

        <motion.div className="br24-login-card" {...fade(0.1)}>
          <div className="br24-login-card-header">
            <p className="br24-login-card-kicker">{kicker}</p>
            <h2 className="br24-login-card-title">{title}</h2>
          </div>
          <div className="br24-login-card-body">{children}</div>
          <div className="br24-login-card-footer">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}

/** Theme-aware tsparticles colors from active accent (ThemeSettings). */
export function getLoginParticleTheme(isDark: boolean, accent: string) {
  if (isDark) {
    return {
      background: '#0b1220',
      particle: adjustHex(accent, 70),
      link: adjustHex(accent, 40),
    };
  }
  return {
    background: '#f1f5f9',
    particle: adjustHex(accent, -25),
    link: accent,
  };
}

export function loginFieldSx(isDark: boolean, accent: string) {
  return {
    color: isDark ? '#e2e8f0' : '#0f172a',
    backgroundColor: isDark ? 'rgba(15,23,42,0.35)' : 'rgba(248,249,251,0.92)',
    borderRadius: '0.625rem',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: isDark ? 'rgba(148,163,184,0.35)' : 'rgba(15,23,42,0.18)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: accent,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: accent,
    },
  };
}

export function loginLabelSx(isDark: boolean) {
  return { color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.65)' };
}
