import { memo } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarBadge } from './ui/avatar';
import { resolvePillHex } from '../utils/pillColors';

const PlayerIdAvatar = memo(function PlayerIdAvatar({ id, isStaff = false, size = 'md', staffColor }) {
  const sizes = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-7 w-7 text-[11px]',
  };

  const staffHex = resolvePillHex('staff', { staff: staffColor });

  return (
    <Avatar className={sizes[size]}>
      <AvatarFallback className="bg-secondary text-[inherit] font-bold">
        {id}
      </AvatarFallback>
      {isStaff ? (
        <AvatarBadge
          className="border-card"
          style={{ backgroundColor: staffHex, boxShadow: `0 0 8px ${staffHex}88` }}
        >
          <Star size={8} className="text-card" strokeWidth={2.5} fill="currentColor" />
        </AvatarBadge>
      ) : null}
    </Avatar>
  );
});

export default PlayerIdAvatar;
