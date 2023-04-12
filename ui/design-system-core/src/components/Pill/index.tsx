import React from 'react';
import Icon from '../Icon';
import { IconType } from '@akashaorg/typings/ui';
import Text from '../Text';
import { tw, apply } from '@twind/core';
import Button from '../Button';

export type pillSize = 'small' | 'large';

export interface IPill {
  infoLabel?: string;
  size?: pillSize;
  secondaryBg?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  handleDismiss?: () => void;
}

const Pill: React.FC<IPill> = ({
  infoLabel = 'Pill Text',
  size = 'small',
  secondaryBg = false,
  leadingIcon,
  trailingIcon,
  handleDismiss,
}) => {
  const buttonSize = size === 'small' ? 'px-2 py-1 max-w-fit' : 'px-4 py-2 max-w-fit';

  const bgColor = secondaryBg
    ? 'bg-secondaryLight/30 dark:bg-secondaryDark text-secondaryLight dark:text-grey1'
    : 'bg-white dark:bg-black text-secondaryLight dark:text-secondaryDark';

  const textColor = secondaryBg
    ? { dark: 'grey1', light: 'secondaryLight' }
    : { dark: 'secondaryDark', light: 'secondaryLight' };

  const instanceStyle = apply`
  flex items-center
  ${bgColor}
  border([1px] secondaryLight dark:secondaryDark) rounded-full
  ${buttonSize}
  `;

  return (
    <div className={tw(instanceStyle)}>
      {leadingIcon && (
        <span className={tw('mr-2')}>
          <Icon type={leadingIcon} customStyle="w-4 h-4" />
        </span>
      )}
      <Text variant="body1" color={textColor}>
        {infoLabel}
      </Text>
      {trailingIcon && (
        <Button
          customStyle="ml-2"
          plain={true}
          onClick={handleDismiss}
          data-testid="dismiss-button"
        >
          <Icon type={trailingIcon} customStyle="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default Pill;
