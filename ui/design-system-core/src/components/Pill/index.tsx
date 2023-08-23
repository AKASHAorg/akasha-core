import React from 'react';
import Button from '../Button';
import { ButtonProps } from '../Button/types';

export type PillProps = {
  label: ButtonProps['label'];
  size?: ButtonProps['size'];
  icon?: ButtonProps['icon'];
  iconDirection?: ButtonProps['iconDirection'];
  customStyle?: ButtonProps['customStyle'];
  active?: boolean;
  onPillClick?: (active?: boolean) => void;
};

const Pill: React.FC<PillProps> = ({
  label,
  size,
  icon,
  iconDirection,
  customStyle = '',
  active,
  onPillClick,
}) => {
  const handlePillClick = () => {
    if (onPillClick) {
      onPillClick(!active);
    }
  };

  return (
    <Button
      aria-label="dismiss"
      hover={false}
      label={label}
      size={size}
      icon={icon}
      iconDirection={iconDirection}
      customStyle={customStyle}
      active={active}
      onClick={handlePillClick}
    />
  );
};

export default Pill;
