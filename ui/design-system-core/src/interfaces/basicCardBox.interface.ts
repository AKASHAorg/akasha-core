export interface IBasicCardBox {
  elevation?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  callToAction?: boolean;
  dashedBorder?: boolean;
  redDashedBorder?: boolean;
  darkBorder?: boolean;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: string;
  margin?: string;
  round?: string;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  bottomBorderOnly?: boolean;
  accentBorderTop?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}
