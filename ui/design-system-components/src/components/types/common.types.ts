export type ButtonType = {
  label: string;
  disabled?: boolean;
  handleClick: (event: React.SyntheticEvent<Element, Event>) => void;
};
