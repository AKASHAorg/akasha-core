import { TooltipProps } from './index';

export function getContentClasses(placement: TooltipProps['placement'], arrowSize: number) {
  switch (placement) {
    case 'left':
      return `flex flex-row-reverse items-center mr-[${arrowSize}px]`;
    case 'top':
      return `flex flex-col flex-col-reverse items-center`;
    case 'right':
      return `flex items-center ml-[${arrowSize}px]`;
    case 'bottom':
      return `flex flex-col items-center`;
  }
}
