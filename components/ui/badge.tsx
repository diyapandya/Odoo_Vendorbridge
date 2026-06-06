import { cn } from '@/lib/utils/cn';

export function Badge({ children, variant = 'info' }: {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}) {
  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-semibold rounded-full",
      variant === 'success' && "bg-green-100 text-green-800",
      variant === 'warning' && "bg-amber-100 text-amber-800",
      variant === 'danger' && "bg-red-100 text-red-800",
      variant === 'info' && "bg-indigo-100 text-indigo-800"
    )}>
      {children}
    </span>
  );
}