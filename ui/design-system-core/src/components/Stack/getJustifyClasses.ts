import { Justify } from './index';

export function getJustifyClasses(justify: Justify) {
  switch (justify) {
    case 'start':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'end':
      return 'justify-end';
    case 'between':
      return 'justify-between';
    case 'around':
      return 'justify-around';
    case 'evenly':
      return 'justify-evenly';
  }
}
