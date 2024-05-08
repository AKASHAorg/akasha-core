import { apply } from '@twind/core';
import { TooltipProps } from './index';

export function getContentClasses(placement: TooltipProps['placement'], arrowSize: number) {
  switch (placement) {
    case 'left':
      return apply`flex flex-row-reverse items-center mr-[${arrowSize}px]`;
    case 'top':
      return apply`flex flex-col flex-col-reverse items-center`;
    case 'right':
      return apply`flex items-center ml-[${arrowSize}px]`;
    case 'bottom':
      return apply`flex flex-col items-center`;
  }
}
