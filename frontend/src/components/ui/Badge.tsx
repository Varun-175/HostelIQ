import { HTMLAttributes } from 'react';
import { cn } from './Button';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "bg-slate-100 text-slate-800 border border-slate-200",
    success: "bg-success-100 text-success-800 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    danger: "bg-danger-100 text-danger-800 border border-danger-200",
    outline: "border-2 border-slate-200 text-slate-800",
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors", 
        variants[variant], 
        className
      )} 
      {...props} 
    />
  );
}
