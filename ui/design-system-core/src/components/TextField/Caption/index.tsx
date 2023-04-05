import React, { PropsWithChildren } from 'react';
import Icon from '../../Icon';
import Text from '../../Text';
import Stack from '../../Stack';
import { Status } from '../../types/common.types';
import { CaptionProps } from '../types';
import { IconType } from '@akashaorg/typings/ui';
import { getIconClasses } from '../Input/getIconClasses';

const Caption: React.FC<PropsWithChildren<CaptionProps>> = ({ status, disabled, children }) => {
  const iconStyle = getIconClasses(disabled, status);
  const textColor = status
    ? status
    : {
        light: 'text-grey4',
        dark: 'text-grey6',
      };

  if (disabled) return null;

  return (
    <Stack align="center" spacing="gap-1.5">
      {status && <Icon type={STATUS_TO_ICON_MAP[status]} color={iconStyle} />}
      <Text color={textColor} variant="footnotes2" weight="normal">
        {children}
      </Text>
    </Stack>
  );
};

const STATUS_TO_ICON_MAP: Record<Status, IconType> = {
  success: 'CheckCircleIcon',
  error: 'XCircleIcon',
  warning: 'ExclamationTriangleIcon',
};

export default Caption;
