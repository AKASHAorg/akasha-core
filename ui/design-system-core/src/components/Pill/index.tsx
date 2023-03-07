import React from 'react';
import Icon, { IconType } from '../Icon';
import Text from '../Text';
import { tw, apply } from '@twind/core';

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
    ? 'bg-secondary-light/30 dark:bg-secondary-dark text-secondary-light dark:text-grey1'
    : 'bg-white dark:bg-black text-secondary-light dark:text-secondary-dark';
  const textColor = secondaryBg
    ? 'text-secondary-light dark:text-grey1'
    : 'text-secondary-light dark:text-secondary-dark';
  const instanceStyle = apply`
  flex items-center
  ${bgColor}
  border([1px] secondary-light dark:secondary-dark) rounded-full
  ${buttonSize}
  `;

  return (
    <div className={tw(instanceStyle)}>
      {leadingIcon && (
        <span className={tw('mr-2')}>
          <Icon type={leadingIcon} styling="w-4 h-4" />
        </span>
      )}
      <Text variant="body1" color={tw(textColor)}>
        {infoLabel}
      </Text>
      {trailingIcon && (
        <span className={tw('ml-2')} onClick={handleDismiss}>
          <Icon type={trailingIcon} styling="w-4 h-4" />
        </span>
      )}
    </div>
  );
};

export default Pill;
