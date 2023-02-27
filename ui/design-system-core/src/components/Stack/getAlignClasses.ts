import { Align } from './index';

export function getAlignClasses(align: Align) {
  switch (align) {
    case 'center':
      return 'items-center';
    case 'end':
      return 'items-end';
    case 'start':
      return 'items-start';
    case 'stretch':
      return 'items-stretch';
    case 'baseline':
      return 'items-baseline';
  }
}
