import React from 'react';
import { tw, apply } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';

import Icon from '../Icon';
import Text from '../Text';

export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconType;
  iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  subtitle?: string;
  subtitleIcon?: IconType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
}

const baseStyles = apply`
  py-2
  pl-2
  flex
  bg-white
  dark:bg-grey2
  items-center
  justify-center
`;

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    iconType,
    // iconSize,
    backgroundColor,
    backgroundSize,
    label,
    subtitle,
    onClick,
    maxWidth,
  } = props;

  const InstanceWrapperStyle = apply`
    ${baseStyles}
    ${maxWidth}
    `;

  const iconBackgroundStyle = apply`
    flex flex-row justify-center items-center mr-2
    ${backgroundSize ? backgroundSize : 'w-10 h-10'}
    ${backgroundColor ? 'bg-grey8 dark:bg-grey3 rounded-full' : 'none'}`;

  return (
    <div
      data-testid={`${props['data-testid']}`}
      className={tw(InstanceWrapperStyle)}
      onClick={onClick}
    >
      {iconType ? (
        <div className={tw(iconBackgroundStyle)}>
          <Icon
            type={iconType}
            size={{ width: 'w-4', height: 'h-5' }}
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          />
        </div>
      ) : null}
      <div className={tw(apply('flex flex-col max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])'))}>
        <Text variant="button-sm" weight="bold" truncate={true}>
          {label}
        </Text>
        <Text variant="footnotes2" color="grey7" truncate={true}>
          {subtitle}
        </Text>
      </div>
    </div>
  );
};

export default SubtitleTextIcon;
