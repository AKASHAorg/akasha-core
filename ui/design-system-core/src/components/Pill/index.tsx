import React, { useState } from 'react';
import Button from '../Button';
import { ButtonProps } from '../Button/types';

export interface IPillProps {
  label: ButtonProps['label'];
  size?: ButtonProps['size'];
  icon?: ButtonProps['icon'];
  iconDirection?: ButtonProps['iconDirection'];
  customStyle?: ButtonProps['customStyle'];
  active?: boolean;
  clickable?: boolean;
  onPillClick?: (active: boolean) => void;
}

const Pill: React.FC<IPillProps> = ({
  label,
  size,
  icon,
  iconDirection,
  customStyle,
  active,
  clickable = false,
  onPillClick,
}) => {
  const [pillActive, setPillActive] = useState(active);

  const handlePillClick = () => {
    if (clickable) {
      setPillActive(!pillActive);
    }

    if (onPillClick) {
      onPillClick(!pillActive);
    }
  };

  return (
    <Button
      data-testid="dismiss-button"
      hover={false}
      label={label}
      size={size}
      icon={icon}
      iconDirection={iconDirection}
      customStyle={customStyle}
      active={pillActive}
      onClick={handlePillClick}
    />
  );
};

export default Pill;
