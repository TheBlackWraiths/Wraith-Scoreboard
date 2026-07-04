import { memo, useMemo, useState } from 'react';
import { Search, Wifi } from 'lucide-react';
import PlayerIdAvatar from './PlayerIdAvatar';
import PillBadge from './PillBadge';
import { cn } from '../lib/utils';

const PlayerRow = memo(function PlayerRow({ id, name, job, tagColor, onDuty, ping, isStaff, pillColors }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <PlayerIdAvatar id={id} isStaff={isStaff} size="sm" staffColor={pillColors?.staff} />
        <div className="flex min-w-0 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium leading-snug text-foreground break-words">{name}</p>
          <PillBadge color={tagColor || 'gray'} pillColors={pillColors} className="mt-1 text-[10px] sm:hidden">
            {job}
            {onDuty !== undefined ? ` (${onDuty ? 'on duty' : 'off duty'})` : ''}
          </PillBadge>
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <PillBadge color={tagColor || 'gray'} pillColors={pillColors} className="hidden shrink-0 text-[10px] sm:inline-flex">
          {job}
          {onDuty !== undefined ? ` (${onDuty ? 'on duty' : 'off duty'})` : ''}
        </PillBadge>
        <div className="flex items-center gap-1 text-[11px] font-medium text-green-400">
          <Wifi size={11} />
          <span>{ping}ms</span>
        </div>
      </div>
    </div>
  );
});

const PlayerGrid = memo(function PlayerGrid({ players = [], pillColors = {} }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.job?.toLowerCase().includes(q) ||
        String(p.id).includes(q),
    );
  }, [players, query]);

  if (!players.length) return null;

  return (
    <div>
      <div className="relative mb-3">
        <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players..."
          className={cn(
            'h-8 w-full rounded-md border border-border bg-secondary/50 pl-8 pr-3 text-xs text-foreground',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring',
          )}
        />
      </div>
      <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((player) => (
          <PlayerRow key={player.id} {...player} pillColors={pillColors} />
        ))}
      </div>
    </div>
  );
});

export default PlayerGrid;
