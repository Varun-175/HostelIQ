import { cn } from './Button';

interface LogoProps {
  compact?: boolean;
  className?: string;
  labelClassName?: string;
  light?: boolean;
}

export function Logo({ compact = false, className, labelClassName, light = false }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)} aria-label="HostelIQ">
      {/* Modern, abstract geometric logo mark */}
      <svg className="h-10 w-10 shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#paint0_linear)" />
        <path d="M12 28V15C12 13.3431 13.3431 12 15 12H25C26.6569 12 28 13.3431 28 15V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 20H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="16" r="1.5" fill="white" />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      
      {!compact && (
        <span className={cn(
          'text-2xl font-bold tracking-tight display-font', 
          light ? 'text-white' : 'text-slate-900',
          labelClassName
        )}>
          Hostel<span className={light ? 'text-primary-300' : 'text-primary-600'}>IQ</span>
        </span>
      )}
    </div>
  );
}
