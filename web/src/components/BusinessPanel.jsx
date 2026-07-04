import { memo } from 'react';
import { getIcon } from '../utils/theme';
import { cn } from '../lib/utils';

const BusinessPanel = memo(function BusinessPanel({ section }) {
  if (!section) return null;

  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-2.5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {section.label} — {section.count} online
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {section.businesses.map((business) => {
          const Icon = getIcon(business.icon);
          return (
            <div
              key={business.id}
              className={cn(
                'flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs',
                business.active
                  ? 'border-border bg-secondary text-foreground'
                  : 'border-border/60 bg-card/50 text-muted-foreground',
              )}
            >
              <Icon size={14} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate font-medium">{business.label}</span>
              <span className="font-bold tabular-nums">{business.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default BusinessPanel;
