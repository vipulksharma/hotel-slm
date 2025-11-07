'use client';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-success-100 text-success-700 border-success-400 shadow-soft',
    danger: 'bg-danger-100 text-danger-700 border-danger-400 shadow-soft',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400 shadow-soft',
    info: 'bg-primary-100 text-primary-700 border-primary-300 shadow-soft',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
