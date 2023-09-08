import React, { PropsWithChildren } from 'react';
import Icon from '../../Icon';
import Text from '../../Text';
import Stack from '../../Stack';
import { Color, Status } from '../../types/common.types';
import { CaptionProps } from '../types';
import { IconType } from '@akashaorg/typings/ui';
import { getIconClasses } from '../Input/getIconClasses';

const Caption: React.FC<PropsWithChildren<CaptionProps>> = ({ status, children }) => {
  const iconStyle = getIconClasses(status);
  const textColor: Color = status
    ? status
    : {
        light: 'grey4',
        dark: 'grey6',
      };

  return (
    <Stack direction="row" align="center" spacing="gap-1.5">
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
