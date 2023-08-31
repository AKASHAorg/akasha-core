import { TextAlignment } from './index';

export function getAlignmentClasses(align: TextAlignment) {
  switch (align) {
    case 'start':
      return 'text-start';
    case 'center':
      return 'text-center';
    case 'justify':
      return 'text-justify';
    case 'end':
      return 'text-end';
  }
}
