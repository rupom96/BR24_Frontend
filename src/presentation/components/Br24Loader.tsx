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
