import React, { useState } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';
import { ButtonProps } from '../Button/types';
import { Color } from '../types/common.types';
import { getColorClasses } from '../../utils';

type ActionPillProps = Pick<ButtonProps, 'label' | 'size' | 'icon' | 'iconDirection'> & {
  hover?: { icon: ButtonProps['icon']; active: boolean };
  active?: boolean;
  loading?: boolean;
  customStyle?: string;
  onPillClick?: (active?: boolean) => void;
};

export type PillProps =
  | (ActionPillProps & { type: 'action' })
  | {
      label: string;
      borderColor?: Color;
      background?: Color;
      customStyle?: string;
      type: 'info';
    };

const Pill: React.FC<PillProps> = props => {
  if (props.type === 'info') {
    const borderStyle = props.borderColor
      ? `border ${getColorClasses(props.borderColor, 'border')}`
      : '';
    return (
      <Stack
        align="center"
        justify="center"
        background={props.background}
        customStyle={`m-h-[18px] m-w-[18px] rounded-full ${borderStyle} ${props.customStyle}`}
      >
        <Text variant="footnotes2" color="white">
          {props.label}
        </Text>
      </Stack>
    );
  }

  return <ActionPill {...props} />;
};

const ActionPill: React.FC<ActionPillProps> = props => {
  const { label, size, active, hover, icon, iconDirection, loading, customStyle, onPillClick } =
    props;
  const [showHover, setShowHover] = useState(false);
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
      icon={showHover && hover ? hover.icon : icon}
      iconDirection={iconDirection}
      active={showHover && hover ? hover.active : active}
      loading={loading}
      customStyle={customStyle}
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={handlePillClick}
    />
  );
};

export default Pill;
