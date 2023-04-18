import React from 'react';
import { tw, apply } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';

import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';

export type PillSize = 'xs' | 'sm' | 'lg';

export interface IPillProps {
  customStyle?: string;
  label: string;
  size?: PillSize;
  clickable?: boolean;
  secondaryBg?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  onPillClick?: () => void;
}

const Pill: React.FC<IPillProps> = ({
  customStyle = '',
  label,
  size = 'sm',
  clickable = false,
  secondaryBg = false,
  leadingIcon,
  trailingIcon,
  onPillClick,
}) => {
  const buttonSizesMap = {
    xs: '',
    sm: 'px-2 py-1',
    lg: 'px-4 py-2',
  };

  const handlePillClick = () => {
    if (onPillClick && typeof onPillClick === 'function' && clickable) {
      onPillClick();
    }
  };

  const bgColor = secondaryBg
    ? 'bg(secondaryLight/30 dark:secondaryDark) text(secondaryLight dark:grey1)'
    : 'bg(white dark:black) text(secondaryLight dark:secondaryDark)';

  const cursorStyle = `cursor-${clickable ? 'pointer' : 'default'}`;

  const instanceStyle = apply`max-w-fit flex items-center space-x-2 ${bgColor} border(1 secondaryLight dark:secondaryDark) rounded-full ${buttonSizesMap[size]} ${cursorStyle} ${customStyle}
  `;

  return (
    <div className={tw(instanceStyle)} onClick={handlePillClick}>
      {leadingIcon && <Icon type={leadingIcon} customStyle="w-4 h-4" />}

      <Text
        variant="body1"
        color={
          secondaryBg
            ? { light: 'secondaryLight', dark: 'grey1' }
            : { light: 'secondaryLight', dark: 'secondaryDark' }
        }
      >
        {label}
      </Text>

      {trailingIcon && (
        <Button plain={true} data-testid="dismiss-button">
          <Icon type={trailingIcon} customStyle="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default Pill;
