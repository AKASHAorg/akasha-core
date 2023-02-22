import React, { PropsWithChildren } from 'react';
import Icon, { IconType } from '../../Icon';
import Text from '../../Text';
import { Status, STATUS_TO_COLOR_MAP } from '../../types/common.types';
import { apply, tw } from '@twind/core';
import { CaptionProps } from '../types';
import { getIconClasses } from './getIconClasses';

const Caption: React.FC<PropsWithChildren<CaptionProps>> = ({ status, disabled, children }) => {
  const iconStyle = getIconClasses(status);
  const textColor = status
    ? STATUS_TO_COLOR_MAP[status]
    : {
        light: 'text-grey4',
        dark: 'text-grey6',
      };

  if (disabled) return null;

  return (
    <div
      className={tw(apply('flex items-center	gap-1.5'))} /* @TODO: Replace with stack component */
    >
      {status && <Icon type={STATUS_TO_ICON_MAP[status]} styling={tw(apply(iconStyle))} />}
      <Text color={textColor} variant="footnotes2" weight="normal">
        {children}
      </Text>
    </div>
  );
};

const STATUS_TO_ICON_MAP: Record<Status, IconType> = {
  success: 'CheckCircleIcon',
  error: 'XCircleIcon',
  warning: 'ExclamationTriangleIcon',
};

export default Caption;
