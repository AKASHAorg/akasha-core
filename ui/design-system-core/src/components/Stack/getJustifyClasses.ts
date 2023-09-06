import { Justify, JustifyItems, JustifySelf } from './index';

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

export function getJustifyItemsClasses(justify: JustifyItems) {
  switch (justify) {
    case 'start':
      return 'justify-items-start';
    case 'center':
      return 'justify-items-center';
    case 'end':
      return 'justify-items-end';
    case 'stretch':
      return 'justify-items-stretch';
  }
}

export function getJustifySelfClasses(justify: JustifySelf) {
  switch (justify) {
    case 'auto':
      return 'justify-self-auto';
    case 'start':
      return 'justify-self-start';
    case 'end':
      return 'justify-self-end';
    case 'center':
      return 'justify-self-center';
    case 'stretch':
      return 'justify-self-stretch';
  }
}
