import React from 'react';
import { tw, apply } from '@twind/core';
import { IconName } from '../Icon';
import Icon from '../Icon';

export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconName;
  iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  labelColor?: string;
  labelSize?: 'small' | 'large';
  subtitle?: string;
  subtitleColor?: string;
  subtitleIcon?: IconName;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
}

const baseStyles = apply`
  py-2
  pl-2
  flex
  flex-column
  rounded-md
  bg-white
  dark:bg-grey2
  items-center
  max-w-[7rem]
`;

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    className,
    iconType,
    iconSize,
    backgroundColor,
    backgroundSize,
    label,
    labelColor,
    labelSize,
    subtitle,
    subtitleColor,
    subtitleIcon,
    onClick,
    gap,
    maxWidth,
  } = props;

  return (
    <div data-testid={`${props['data-testid']}`} className={tw(baseStyles)} onClick={onClick}>
      {iconType ? (
        <div
          className={tw(
            `flex flex-row justify-center items-center mr-2 ${
              backgroundSize ? backgroundSize : 'w-12 h-12'
            } ${props.backgroundColor ? 'bg-green-200 rounded-sm' : 'none'}`,
          )}
        >
          <Icon icon={iconType} styling={`${iconSize ? iconSize : 'h-4, w-4'} black`} />
        </div>
      ) : null}
      <div className={tw('flex flex-column')}>
        <div className={tw('container')}>
          <span
            className={tw(
              `${labelColor ? labelColor : 'black'} ${
                labelSize ? labelSize : 'text-xs font-medium'
              }`,
            )}
          >
            {label}
          </span>
          <p className={tw(`${subtitleColor ? subtitleColor : 'black'} text-xs`)}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

SubtitleTextIcon.defaultProps = {
  labelColor: 'primaryText',
  labelSize: 'large',
  subtitleColor: 'secondaryText',
};

export default SubtitleTextIcon;
