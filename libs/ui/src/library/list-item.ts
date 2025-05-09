export type ListItem = {
  label: string;
  icon?: React.ReactElement;
  color?: string;
  disabled?: boolean;
  onClick?: (label?: string) => void;
};
