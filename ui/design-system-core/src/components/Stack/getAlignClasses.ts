import { Align, AlignSelf } from './index';

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

export function getAlignSelfClasses(align: AlignSelf) {
  switch (align) {
    case 'auto':
      return 'self-auto';
    case 'start':
      return 'self-start';
    case 'end':
      return 'self-end';
    case 'center':
      return 'self-center';
    case 'stretch':
      return 'self-stretch';
  }
}
