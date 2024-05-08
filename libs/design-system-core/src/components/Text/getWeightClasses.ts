import { FontWeight } from './index';

export function getWeightClasses(align: FontWeight) {
  switch (align) {
    case 'normal':
      return 'font-normal';
    case 'medium':
      return 'font-medium';
    case 'semibold':
      return 'font-semibold';
    case 'light':
      return 'font-light';
    case 'bold':
      return 'font-bold';
  }
}
