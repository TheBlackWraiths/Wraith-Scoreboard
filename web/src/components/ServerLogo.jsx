import { memo, useState, useEffect } from 'react';
import { getInitials } from '../utils/theme';
import { cn } from '../lib/utils';

const DEFAULT_LOGO_PATH = './images/server_logo.png';

const ServerLogo = memo(function ServerLogo({ serverName, logoPath, useLogo = true }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showImage = useLogo && logoPath && !logoFailed;

  useEffect(() => {
    setLogoFailed(false);
  }, [logoPath]);

  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full',
        !showImage && 'bg-secondary text-xs font-bold text-foreground',
      )}
    >
      {showImage ? (
        <img
          src={logoPath}
          alt={`${serverName} logo`}
          className="h-full w-full object-cover"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        getInitials(serverName)
      )}
    </div>
  );
});

export { ServerLogo, DEFAULT_LOGO_PATH };
