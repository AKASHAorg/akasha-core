interface IGetLabel {
  active: boolean;
  hovered: boolean;
  activeHoverLabel: string;
  activeLabel: string;
  inactiveLabel: string;
}

export const getLabel = ({
  active,
  hovered,
  activeHoverLabel,
  activeLabel,
  inactiveLabel,
}: IGetLabel) => {
  //determine the label to use based on the active and hovered states
  if (active) return hovered ? activeHoverLabel : activeLabel;
  return inactiveLabel;
};
