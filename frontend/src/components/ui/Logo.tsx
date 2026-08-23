import { cn } from './Button';

interface LogoProps {
  compact?: boolean;
  className?: string;
  labelClassName?: string;
}

export function Logo({ compact = false, className, labelClassName }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)} aria-label="HostelIQ">
      <svg className="h-10 w-10 shrink-0" viewBox="0 0 40 40" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="hosteliq-logo-gradient" x1="5" y1="4" x2="35" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#hosteliq-logo-gradient)" />
        <path d="M11 27V15.5C11 14.12 12.12 13 13.5 13h13c1.38 0 2.5 1.12 2.5 2.5V27" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 21h18M14 21v6M26 21v6" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M30.5 9.5v3M29 11h3" fill="none" stroke="#fef3c7" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {!compact && <span className={cn('font-bold tracking-tight text-slate-950', labelClassName)}>Hostel<span className="text-primary-600">IQ</span></span>}
    </div>
  );
}
