import { Direction } from './index';

export function getDirectionClasses(direction: Direction) {
  switch (direction) {
    case 'column':
      return 'flex-col';
    case 'column-reverse':
      return 'flex-col-reverse';
    case 'row':
      return 'flex-row';
    case 'row-reverse':
      return 'flex-row-reverse';
  }
}
