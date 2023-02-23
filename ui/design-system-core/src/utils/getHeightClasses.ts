export function getHeightClasses(height: string) {
  if (!height) return '';

  if (height.startsWith('h-')) {
    return height;
  }

  return !Number.isInteger(+height[0]) ? `h-[${height}]` : '';
}
