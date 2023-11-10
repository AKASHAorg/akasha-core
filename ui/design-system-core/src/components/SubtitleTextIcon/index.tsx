import React from 'react';

import { IconType } from '@akashaorg/typings/lib/ui';

import Stack from '../Stack';
import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';

export type SubtitleTextIconProps = {
  customStyle?: string;
  dataTestId?: string;
  iconType?: IconType;
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  subtitle?: string;
  subtitleIcon?: IconType;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
};

const SubtitleTextIcon: React.FC<SubtitleTextIconProps> = props => {
  const {
    customStyle = '',
    iconType,
    backgroundColor,
    backgroundSize,
    label,
    subtitle,
    maxWidth,
    dataTestId,
    onClick,
  } = props;

  const baseStyles = `flex items-center justify-center bg(white dark:grey2) gap-x-2`;

  const InstanceWrapperStyle = `${baseStyles} ${maxWidth} ${customStyle}`;

  const iconBackgroundStyle = `${backgroundSize ? backgroundSize : 'w-10 h-10'} ${
    backgroundColor ? 'bg(grey8 dark:grey3) rounded-full' : 'none'
  }`;

  return (
    <Button
      plain={true}
      data-testid={dataTestId}
      customStyle={InstanceWrapperStyle}
      onClick={onClick}
    >
      {iconType && (
        <Stack direction="row" align="center" justify="center" customStyle={iconBackgroundStyle}>
          <Icon
            type={iconType}
            size={{ width: 'w-4', height: 'h-5' }}
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          />
        </Stack>
      )}

      <Stack customStyle="max-w(xl:[8rem] lg:[10rem] md:[6rem] xs:[2rem])">
        <Text variant="button-sm" weight="bold" truncate={true}>
          {label}
        </Text>

        <Text variant="footnotes2" color="grey7" truncate={true}>
          {subtitle}
        </Text>
      </Stack>
    </Button>
  );
};

export default SubtitleTextIcon;
