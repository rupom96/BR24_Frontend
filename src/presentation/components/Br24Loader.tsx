import { CircularProgress, Skeleton } from '@mui/material';

type Br24PageLoaderProps = {
  label?: string;
  minHeight?: string;
};

/** Full-area centered spinner for page / route loading states */
export function Br24PageLoader({
  label = 'Loading',
  minHeight = '40vh',
}: Br24PageLoaderProps) {
  return (
    <div
      className="br24-anim-fade-in flex w-full flex-col items-center justify-center gap-4"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="br24-spinner" aria-hidden />
      <p className="text-sm font-medium tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

/** Compact spinner for inline / card body loading */
export function Br24InlineLoader({ label }: { label?: string }) {
  return (
    <div
      className="br24-anim-fade-in flex items-center justify-center gap-3 py-8"
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={28} thickness={4} sx={{ color: '#0d9488' }} />
      {label ? (
        <span className="text-sm text-slate-500">{label}</span>
      ) : null}
    </div>
  );
}

/** Sidebar menu placeholder skeleton */
export function Br24MenuSkeleton() {
  return (
    <div className="br24-anim-fade-in mt-8 space-y-6 px-3" aria-hidden>
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-2">
          <Skeleton
            variant="text"
            width="40%"
            height={16}
            sx={{ bgcolor: 'rgba(148,163,184,0.25)' }}
          />
          {[0, 1, 2, 3].map((row) => (
            <Skeleton
              key={row}
              variant="rounded"
              height={36}
              sx={{
                borderRadius: '0.75rem',
                bgcolor: 'rgba(148,163,184,0.18)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Generic content skeleton block */
export function Br24ContentSkeleton() {
  return (
    <div className="br24-anim-fade-in w-full space-y-3 p-4" aria-hidden>
      <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
      </div>
      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
    </div>
  );
}

const eventCardSx = {
  bgcolor: 'rgba(148,163,184,0.18)',
};

/** Event-list placeholder — matches EventsOfAChain card layout */
export function Br24EventCardsSkeleton({
  count = 4,
  label = 'Loading events…',
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div
      className="br24-anim-fade-in w-full space-y-5 py-2"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Skeleton
        variant="rounded"
        height={40}
        sx={{ borderRadius: '0.5rem', ...eventCardSx }}
      />
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="w-full rounded-xl border border-zinc-200/80 bg-slate-100/60 p-[0.9375rem] dark:border-zinc-800 dark:bg-slate-900/40"
          aria-hidden
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <Skeleton
              variant="text"
              width="18%"
              height={18}
              sx={eventCardSx}
            />
            <Skeleton
              variant="text"
              width="42%"
              height={18}
              sx={eventCardSx}
            />
            <Skeleton
              variant="text"
              width="20%"
              height={18}
              sx={eventCardSx}
            />
          </div>
          <Skeleton
            variant="text"
            width="70%"
            height={28}
            sx={{ mb: 0.5, ...eventCardSx }}
          />
          <Skeleton
            variant="text"
            width="45%"
            height={18}
            sx={{ mb: 1.5, ...eventCardSx }}
          />
          <div className="mb-3 flex gap-2">
            <Skeleton
              variant="rounded"
              width={88}
              height={22}
              sx={{ borderRadius: '0.3125rem', ...eventCardSx }}
            />
            <Skeleton
              variant="rounded"
              width={72}
              height={22}
              sx={{ borderRadius: '0.3125rem', ...eventCardSx }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <Skeleton variant="text" width="30%" height={16} sx={eventCardSx} />
            <Skeleton variant="text" width="28%" height={16} sx={eventCardSx} />
          </div>
        </div>
      ))}
    </div>
  );
}
