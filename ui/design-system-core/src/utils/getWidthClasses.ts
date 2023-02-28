export function getWidthClasses(width: string) {
  if (!width) return '';

  if (width.startsWith('w-')) {
    return width;
  }

  return Number.isInteger(+width[0]) ? `w-[${width}]` : '';
}
