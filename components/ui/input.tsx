import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border rounded-md text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';