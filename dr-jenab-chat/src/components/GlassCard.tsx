import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl',
        'transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
}