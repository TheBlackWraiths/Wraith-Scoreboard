function parseHex(hex) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return null;

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function resolvePillHex(colorKey, pillColors = {}) {
  if (!colorKey) return pillColors.gray || '#737373';
  if (String(colorKey).startsWith('#')) return colorKey;
  return pillColors[colorKey] || pillColors.gray || '#737373';
}

export function getPillStyle(hex) {
  const rgb = parseHex(hex);
  if (!rgb) {
    return {
      borderColor: 'rgba(255, 255, 255, 0.18)',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: '#E5E5E5',
    };
  }

  return {
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`,
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
    color: hex,
  };
}
