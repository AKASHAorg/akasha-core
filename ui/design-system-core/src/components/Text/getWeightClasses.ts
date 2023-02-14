import { Weight } from './index';

export function getWeightClasses(align: Weight) {
  switch (align) {
    case 'normal':
      return 'font-normal';
    case 'medium':
      return 'font-medium';
    case 'light':
      return 'font-light';
    case 'bold':
      return 'font-bold';
  }
}
