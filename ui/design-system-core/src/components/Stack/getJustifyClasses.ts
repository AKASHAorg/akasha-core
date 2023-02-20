import { Justify } from './index';

export function getJustifyClasses(justify: Justify) {
  switch (justify) {
    case 'center':
      return 'justify-items-center';
    case 'end':
      return 'justify-items-end';
    case 'start':
      return 'justify-items-start';
    case 'stretch':
      return 'justify-items-stretch';
  }

  return '';
}
