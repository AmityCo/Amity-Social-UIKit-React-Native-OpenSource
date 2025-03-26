const hexColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const validateConfigColor = (color: string): string => {
  if (!color || !hexColorRegExp.test(color)) return '#00000000';
  return color;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const hexColor = hex.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
