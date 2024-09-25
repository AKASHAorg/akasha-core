import { apply } from '@twind/core';
import { TooltipProps } from './index';
import { Color } from '../types/common.types';
import { getColorClasses } from '../../utils';

const getClass = (
  axis: 'x' | 'y',
  direction: 'r' | 'l' | 'b' | 't',
  arrowSize: number,
  color: Color,
) =>
  apply`h-0 w-0 border-${axis}-${arrowSize} border-${axis}-transparent border-${direction}-[${arrowSize}px] drop-shadow-[${dropShadowByDirection[direction]}_rgba(0,0,0,0.2)] dark:drop-shadow-none ${getColorClasses(
    color,
    `border-${direction}`,
  )}`;

export function getArrowClasses(
  placement: TooltipProps['placement'],
  arrowSize: number,
  color: Color,
) {
  switch (placement) {
    case 'right':
      return getClass('y', 'r', arrowSize, color);
    case 'left':
      return getClass('y', 'l', arrowSize, color);
    case 'top':
      return getClass('x', 't', arrowSize, color);
    case 'bottom':
      return getClass('x', 'b', arrowSize, color);
  }
}

const dropShadowByDirection = {
  t: '0_5px_4px',
  b: '0_-5px_4px',
  r: '-5px_0_4px',
  l: '5px_0_4px',
};
