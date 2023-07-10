import React from 'react';

import { IconType } from '@akashaorg/typings/ui';

import Box from '../Box';
import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';

export interface ISubtitleTextIcon {
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
}

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
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

  const baseStyles = `flex items-center justify-center bg(white dark:grey2) space-x-2`;

  const InstanceWrapperStyle = `${baseStyles} ${maxWidth} ${customStyle}`;

  const iconBackgroundStyle = `flex flex-row justify-center items-center ${
    backgroundSize ? backgroundSize : 'w-10 h-10'
  } ${backgroundColor ? 'bg(grey8 dark:grey3) rounded-full' : 'none'}`;

  return (
    <Button
      plain={true}
      data-testid={dataTestId}
      customStyle={InstanceWrapperStyle}
      onClick={onClick}
    >
      {iconType && (
        <Box customStyle={iconBackgroundStyle}>
          <Icon
            type={iconType}
            size={{ width: 'w-4', height: 'h-5' }}
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          />
        </Box>
      )}

      <Box customStyle="flex flex-col max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])">
        <Text variant="button-sm" weight="bold" truncate={true}>
          {label}
        </Text>

        <Text variant="footnotes2" color="grey7" truncate={true}>
          {subtitle}
        </Text>
      </Box>
    </Button>
  );
};

export default SubtitleTextIcon;
