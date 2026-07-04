import { memo, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { getIcon } from '../utils/theme';
import { cn } from '../lib/utils';

const RobberySection = memo(function RobberySection({ robberies, policeCount }) {
  const sorted = useMemo(() => {
    return [...(robberies ?? [])].sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
  }, [robberies]);

  if (!sorted.length) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield size={13} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Robbery Availability</span>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {policeCount} Police Online
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-3 xl:grid-cols-6">
        {sorted.map((robbery) => {
          const Icon = getIcon(robbery.icon);
          return (
            <div
              key={robbery.id}
              className="rounded-lg border border-border bg-secondary/30 px-2 py-2"
            >
              <div className="mb-1 flex items-center justify-between gap-1">
                <div className="flex min-w-0 items-center gap-1">
                  <Icon size={12} className="shrink-0 text-muted-foreground" />
                  <span className="truncate text-[11px] font-medium text-foreground">{robbery.label}</span>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase',
                    robbery.available
                      ? 'bg-white/10 text-foreground'
                      : 'bg-black/30 text-muted-foreground',
                  )}
                >
                  {robbery.available ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Needs {robbery.requiredPolice} PD
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default RobberySection;
