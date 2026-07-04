import { memo } from 'react';
import { cn } from '../lib/utils';
import { getPillStyle, resolvePillHex } from '../utils/pillColors';

const PillBadge = memo(function PillBadge({ color, pillColors, className, children }) {
  const hex = resolvePillHex(color, pillColors);
  const style = getPillStyle(hex);

  return (
    <span
      className={cn(
        'inline-flex w-fit max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
});

export default PillBadge;
