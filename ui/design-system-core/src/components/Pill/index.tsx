import React from 'react';
import Icon from '../Icon';
import { IconType } from '@akashaorg/typings/ui';
import Text from '../Text';
import { tw, apply } from '@twind/core';
import Button from '../Button';

export type PillSize = 'xs' | 'sm' | 'lg';

export interface IPillProps {
  customStyle?: string;
  label?: string;
  size?: PillSize;
  secondaryBg?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  handleDismiss?: () => void;
}

const Pill: React.FC<IPillProps> = ({
  customStyle = '',
  label,
  size = 'sm',
  secondaryBg = false,
  leadingIcon,
  trailingIcon,
  handleDismiss,
}) => {
  const buttonSizesMap = {
    xs: '',
    sm: 'px-2 py-1',
    lg: 'px-4 py-2',
  };

  const bgColor = secondaryBg
    ? 'bg(secondaryLight/30 dark:secondaryDark) text(secondaryLight dark:grey1)'
    : 'bg(white dark:black) text(secondaryLight dark:secondaryDark)';

  const instanceStyle = apply`max-w-fit flex items-center space-x-2 ${bgColor} border(1 secondaryLight dark:secondaryDark) rounded-full ${buttonSizesMap[size]} ${customStyle}
  `;

  return (
    <div className={tw(instanceStyle)}>
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
        <Button plain={true} onClick={handleDismiss}>
          <Icon type={trailingIcon} customStyle="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default Pill;
