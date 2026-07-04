import { memo, useMemo } from 'react';
import { Star } from 'lucide-react';
import { getIcon } from '../utils/theme';
import { cn } from '../lib/utils';
import { getPillStyle, resolvePillHex } from '../utils/pillColors';

const StaffPill = memo(function StaffPill({ staffCount, pillColors }) {
  const style = getPillStyle(resolvePillHex('staff', pillColors));

  return (
    <div
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
      style={style}
    >
      <Star size={12} className="opacity-90" style={{ color: style.color }} />
      <span className="tabular-nums">{staffCount}</span>
      <span>Staff</span>
    </div>
  );
});

const SectionPill = memo(function SectionPill({ section, isExpanded, onToggleSection, pillColors }) {
  const Icon = getIcon(section.icon);
  const clickable = !section.standalone;
  const style = getPillStyle(section.pillColor || resolvePillHex(section.color, pillColors));

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={clickable ? () => onToggleSection(section.id) : undefined}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-opacity',
        clickable && 'cursor-pointer hover:opacity-90',
        clickable && isExpanded && 'ring-1 ring-white/25',
        !clickable && 'cursor-default',
      )}
      style={style}
    >
      <Icon size={12} />
      <span className="font-bold tabular-nums">{section.count}</span>
      <span className="whitespace-nowrap">{section.shortLabel || section.label}</span>
    </button>
  );
});

const PILLS_PER_ROW = 6;

const JobPills = memo(function JobPills({
  sections = [],
  expandedSectionId,
  onToggleSection,
  showStaffCount = false,
  staffCount = 0,
  pillColors = {},
}) {
  const rows = useMemo(() => {
    const items = [];

    if (showStaffCount) {
      items.push({ type: 'staff', key: 'staff' });
    }

    sections.forEach((section) => {
      items.push({ type: 'section', key: section.id, section });
    });

    const chunked = [];

    for (let i = 0; i < items.length; i += PILLS_PER_ROW) {
      chunked.push(items.slice(i, i + PILLS_PER_ROW));
    }

    return chunked;
  }, [sections, showStaffCount]);

  if (!rows.length) return null;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {rows.map((row, rowIndex) => (
        <div
          key={`pill-row-${rowIndex}`}
          className="flex w-full flex-wrap items-center justify-center gap-2"
        >
          {row.map((item) => {
            if (item.type === 'staff') {
              return <StaffPill key={item.key} staffCount={staffCount} pillColors={pillColors} />;
            }

            return (
              <SectionPill
                key={item.key}
                section={item.section}
                isExpanded={expandedSectionId === item.section.id}
                onToggleSection={onToggleSection}
                pillColors={pillColors}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default JobPills;
