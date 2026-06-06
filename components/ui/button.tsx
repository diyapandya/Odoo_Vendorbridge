import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none",
          variant === 'primary' && "bg-indigo-600 text-white hover:bg-indigo-700",
          variant === 'secondary' && "bg-slate-200 text-slate-800 hover:bg-slate-300",
          variant === 'danger' && "bg-red-600 text-white hover:bg-red-700",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';