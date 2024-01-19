import React from 'react';

import { IconType } from '@akashaorg/typings/lib/ui';

import Stack from '../Stack';
import Icon from '../Icon';
import Text from '../Text';
import Card from '../Card';

export type SubtitleTextIconProps = {
  customStyle?: string;
  dataTestId?: string;
  icon?: React.ReactElement;
  solid?: boolean;
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  labelSize?: 'button-sm' | 'button-lg';
  subtitle?: string;
  subtitleIcon?: IconType;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
};

const SubtitleTextIcon: React.FC<SubtitleTextIconProps> = props => {
  const {
    customStyle = '',
    icon,
    solid,
    backgroundColor,
    backgroundSize,
    label,
    labelSize = 'button-sm',
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
    <Card
      type="plain"
      data-testid={dataTestId}
      customStyle={InstanceWrapperStyle}
      onClick={onClick}
    >
      {icon && (
        <Stack direction="row" align="center" justify="center" customStyle={iconBackgroundStyle}>
          <Icon
            icon={icon}
            solid={solid}
            size={{ width: 'w-4', height: 'h-5' }}
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          />
        </Stack>
      )}

      <Stack customStyle="max-w(xl:[8rem] lg:[10rem] md:[6rem] xs:[2rem])">
        <Text variant={labelSize} weight="bold" truncate={true}>
          {label}
        </Text>

        <Text variant="footnotes2" color="grey7" truncate={true}>
          {subtitle}
        </Text>
      </Stack>
    </Card>
  );
};

export default SubtitleTextIcon;
