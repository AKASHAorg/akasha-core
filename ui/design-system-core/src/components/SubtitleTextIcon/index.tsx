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
  flex-col
  rounded-md
  bg-white
  dark:bg-grey2
  items-center
  justify-center
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
    maxWidth,
  } = props;

  const InstanceStyles = apply`
    ${baseStyles}
    ${maxWidth}
    `;

  return (
    <div data-testid={`${props['data-testid']}`} className={tw(InstanceStyles)} onClick={onClick}>
      {iconType ? (
        <div
          className={tw(
            `flex flex-row justify-center items-center mr-2 ${
              backgroundSize ? backgroundSize : 'w-12 h-12'
            } ${props.backgroundColor ? 'bg-grey1 rounded-sm' : 'none'}`,
          )}
        >
          <Icon icon={iconType} styling={`${iconSize ? iconSize : 'h-4, w-4'} black`} />
        </div>
      ) : null}
      <div
        className={tw(
          'flex flex-col xl:max-w-[10rem] lg:max-w-[8rem] md:max-w-[10rem] xs:max-w-[2rem]',
        )}
      >
        <span
          className={tw(
            `block text-ellipsis overflow-hidden whitespace-nowrap truncate
            ${labelColor ? labelColor : 'black'} 
            ${labelSize ? labelSize : 'lg:text-sm md:text-sx font-light'}`,
          )}
        >
          {label}
        </span>
        <p
          className={tw(`block ${subtitleColor ? subtitleColor : 'black'} text-xs sm:text-[10px]`)}
        >
          {subtitle}
        </p>
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
