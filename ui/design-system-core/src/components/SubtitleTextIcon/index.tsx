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
  flex-col
  rounded-md
  bg-white
  dark:bg-grey2
  items-center
  justify-center
`;

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    iconType,
    iconSize,
    backgroundColor,
    backgroundSize,
    label,
    subtitle,
    onClick,
    maxWidth,
  } = props;

  const InstanceStyles = apply`
    ${baseStyles}
    ${maxWidth}
    `;

  const textTrucateStyle = 'text-ellipsis overflow-hidden whitespace-nowrap truncate';

  return (
    <div data-testid={`${props['data-testid']}`} className={tw(InstanceStyles)} onClick={onClick}>
      {iconType ? (
        <div
          className={tw(
            `flex flex-row justify-center items-center mr-2 ${
              backgroundSize ? backgroundSize : 'w-12 h-12'
            } ${backgroundColor ? 'bg-grey1 rounded-sm' : 'none'}`,
          )}
        >
          <Icon type={iconType} customStyle={`${iconSize ? iconSize : 'h-4, w-4'} black`} />
        </div>
      ) : null}
      <div className={tw('flex flex-col max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])')}>
        <Text customStyle={textTrucateStyle}>{label}</Text>

        <Text customStyle={`${textTrucateStyle}text-xs`}>{subtitle}</Text>
      </div>
    </div>
  );
};

export default SubtitleTextIcon;
