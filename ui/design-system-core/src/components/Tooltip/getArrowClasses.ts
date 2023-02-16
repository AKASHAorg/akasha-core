import { apply } from '@twind/core';
import { TooltipProps } from './index';

const getClass = (axis: 'x' | 'y', direction: 'r' | 'l' | 'b' | 't', arrowSize: number) =>
  apply`h-0 w-0 border-${axis}-${arrowSize} border-${axis}-transparent border-${direction}-[${arrowSize}px] border-${direction}-secondary-dark/50 dark:border-${direction}-grey4`;

export function getArrowClasses(placement: TooltipProps['placement'], arrowSize: number) {
  switch (placement) {
    case 'right':
      return getClass('y', 'r', arrowSize);
    case 'left':
      return getClass('y', 'l', arrowSize);
    case 'top':
      return getClass('x', 't', arrowSize);
    case 'bottom':
      return getClass('x', 'b', arrowSize);
  }
}
