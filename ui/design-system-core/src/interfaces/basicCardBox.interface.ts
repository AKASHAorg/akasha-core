export interface IBasicCardBox {
  elevation?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  dashedBorder?: boolean;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: string;
  margin?: string;
  round?: string;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  onClick?: () => void;
}
