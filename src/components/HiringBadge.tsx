import { cn } from '@/lib/utils';

interface HiringBadgeProps {
  variant?: 'hiring' | 'active' | 'new';
  className?: string;
}

export function HiringBadge({ variant = 'hiring', className }: HiringBadgeProps) {
  const variants = {
    hiring: 'bg-badge-hiring text-primary-foreground',
    active: 'bg-badge-active text-primary-foreground',
    new: 'bg-badge-new text-foreground',
  };

  const labels = {
    hiring: 'HIRING',
    active: 'ACTIVE',
    new: 'NEW',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded',
        variants[variant],
        className
      )}
    >
      {labels[variant]}
    </span>
  );
}
