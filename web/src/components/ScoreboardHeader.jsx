import { memo } from 'react';
import { Wifi, X } from 'lucide-react';
import { Button } from './ui/button';
import { ServerLogo, DEFAULT_LOGO_PATH } from './ServerLogo';
import PlayerIdAvatar from './PlayerIdAvatar';
import PillBadge from './PillBadge';

const ScoreboardHeader = memo(function ScoreboardHeader({
  serverName,
  onlinePlayers,
  maxSlots,
  localPlayer,
  onClose,
  useServerLogo = true,
  serverLogoPath = DEFAULT_LOGO_PATH,
  pillColors = {},
}) {
  const player = localPlayer ?? {};

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <ServerLogo
          serverName={serverName}
          useLogo={useServerLogo}
          logoPath={serverLogoPath}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{serverName}</p>
          <p className="text-[11px] text-muted-foreground">
            {onlinePlayers}/{maxSlots} players
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
        {player.id ? (
          <>
            <PlayerIdAvatar
              id={player.id}
              isStaff={player.isStaff}
              size="md"
              staffColor={pillColors.staff}
            />
            <div className="hidden min-w-0 max-w-[7rem] shrink sm:block lg:max-w-[10rem] xl:max-w-none">
              <p className="truncate text-sm font-medium text-foreground">{player.name}</p>
            </div>
            <PillBadge
              color={player.tagColor || 'gray'}
              pillColors={pillColors}
              className="hidden shrink-0 md:inline-flex"
            >
              {player.job}
              {player.onDuty !== undefined ? ` (${player.onDuty ? 'on duty' : 'off duty'})` : ''}
            </PillBadge>
            <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-400">
              <Wifi size={12} />
              <span>{player.ping ?? 0}ms</span>
            </div>
          </>
        ) : null}
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X size={14} />
        </Button>
      </div>
    </div>
  );
});

export default ScoreboardHeader;
