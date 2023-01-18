export type OverflowType = 'auto' | 'hidden' | 'scroll' | 'visible';

export interface IBasicPopover {
  children: React.ReactNode;
  closePopover: () => void;
  target: HTMLElement;
  gap?: string;
  overflow?: OverflowType | { horizontal?: OverflowType; vertical?: OverflowType };
}
