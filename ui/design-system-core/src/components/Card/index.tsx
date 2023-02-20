import React, { PropsWithChildren } from 'react';
import Stack from '../Stack';
import { tw, apply } from '@twind/core';
import { Color, Elevation, Padding, Radius } from '../types/common.types';
import { getElevationClasses } from '../../utils/getElevationClasses';
import { getRadiusClasses } from '../../utils/getRadiusClasses';
import { getPaddingClasses } from '../../utils/getPaddingClasses';
import { getColorClasses } from '../../utils/getColorClasses';

export type CardProps = {
  elevation?: Elevation;
  background?: Color;
  radius?: Radius;
  padding?: Padding;
  direction?: 'row' | 'column';
  className?: string;
};

const baseStyles = apply`
  flex
`;

export const Card: React.FC<PropsWithChildren<CardProps>> = props => {
  const {
    elevation = 'none',
    background = { light: 'bg-white', dark: 'bg-grey2' },
    radius,
    padding,
    direction,
    className,
  } = props;
  const elevationStyle = getElevationClasses(elevation);
  const radiusStyle = getRadiusClasses(radius);
  const paddingStyle = getPaddingClasses(padding);
  const backgroundStyle = getColorClasses(background);
  const instanceStyles = apply`
    ${baseStyles}
    ${backgroundStyle}
    ${elevationStyle}
    ${radiusStyle}
    ${paddingStyle}
    ${className}
  `;

  return (
    <Stack direction={direction} className={tw(instanceStyles)}>
      {props.children}
    </Stack>
  );
};

export default Card;
