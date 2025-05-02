import React, { PropsWithChildren } from 'react';
import { CheckCircleIcon, TriangleAlertIcon, XCircleIcon } from 'lucide-react';
import Text from '../../Text';
import Stack from '../../Stack';
import { Color, Status } from '../../types/common.types';
import { CaptionProps } from '../types';

const Caption: React.FC<PropsWithChildren<CaptionProps>> = ({
  justifyContents = 'start',
  status,
  children,
}) => {
  const textColor: Color = status
    ? status
    : {
        light: 'grey4',
        dark: 'grey6',
      };

  return (
    <Stack direction="row" align="center" spacing="gap-1.5" justify={justifyContents}>
      {status && STATUS_TO_ICON_MAP[status]}
      <Text color={textColor} variant="footnotes2" weight="normal">
        {children}
      </Text>
    </Stack>
  );
};

const STATUS_TO_ICON_MAP: Record<Status, React.ReactElement> = {
  success: <CheckCircleIcon className="h-5 w-5" />,
  error: <XCircleIcon className="h-5 w-5" />,
  warning: <TriangleAlertIcon className="h-5 w-5" />,
};

export default Caption;
