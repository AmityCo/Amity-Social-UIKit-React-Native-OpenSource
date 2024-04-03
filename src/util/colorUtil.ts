const hexColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const validateConfigColor = (color: string): string => {
  if (!color || !hexColorRegExp.test(color)) return '#00000000';
  return color;
};
