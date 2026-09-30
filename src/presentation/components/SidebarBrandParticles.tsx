import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { adjustHex } from '../Utils/colorUtils';

type Props = {
  accent: string;
  isDark: boolean;
};

/** Subtle theme-palette particles for the sticky Bizness Roots brand strip. */
const SidebarBrandParticles = ({ accent, isDark }: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo((): ISourceOptions => {
    const mid = accent || '#0d9488';
    const light = adjustHex(mid, isDark ? 55 : 70);
    const deep = adjustHex(mid, isDark ? 25 : -35);
    const soft = adjustHex(mid, isDark ? 85 : -15);

    return {
      fullScreen: false,
      background: { color: { value: 'transparent' } },
      fpsLimit: 48,
      detectRetina: true,
      particles: {
        number: {
          value: 22,
          density: { enable: true, width: 320, height: 100 },
        },
        color: { value: [mid, light, deep, soft] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.28, max: 0.62 },
          animation: {
            enable: true,
            speed: 0.55,
            sync: false,
            startValue: 'random',
          },
        },
        size: {
          value: { min: 1.1, max: 2.6 },
        },
        links: {
          enable: true,
          distance: 48,
          color: mid,
          opacity: isDark ? 0.28 : 0.22,
          width: 0.7,
        },
        move: {
          enable: true,
          speed: 0.4,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'bounce' },
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: { enable: true },
        },
        modes: {
          grab: {
            distance: 64,
            links: { opacity: 0.45 },
          },
        },
      },
    };
  }, [accent, isDark]);

  if (!ready) return null;

  return (
    <Particles
      id="br24-sidebar-brand-particles"
      className="br24-sidebar-brand-particles"
      options={options}
    />
  );
};

export default SidebarBrandParticles;
