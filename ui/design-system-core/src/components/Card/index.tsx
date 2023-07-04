import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import Stack from '../Stack';
import { apply } from '@twind/core';
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
  accentBorder?: boolean;
  customStyle?: string;
  testId?: string;
  ref?: LegacyRef<HTMLDivElement>;
};

const baseStyles = 'block';

const Card: React.FC<PropsWithChildren<CardProps>> = forwardRef((props, ref) => {
  const {
    elevation = 'none',
    background = { light: 'white', dark: 'grey2' },
    // default radius as in the design system specs
    radius = 'rounded-2xl',
    padding,
    direction,
    accentBorder,
    customStyle = '',
    testId,
    children,
  } = props;

  const elevationStyle = getElevationClasses(elevation);
  const radiusStyle = getRadiusClasses(radius);
  const paddingStyle = getPaddingClasses(padding);
  const backgroundStyle = getColorClasses(background, 'bg');
  const accentBorderStyle = accentBorder
    ? `border ${getColorClasses({ light: 'secondaryLight', dark: 'secondaryDark' }, 'border')}`
    : '';

  const instanceStyles = apply`
    ${baseStyles}
    ${backgroundStyle}
    ${elevationStyle}
    ${radiusStyle}
    ${paddingStyle}
    ${accentBorderStyle}
    ${customStyle}
  `;

  return (
    <Stack direction={direction} customStyle={instanceStyles} testId={testId} ref={ref}>
      {children}
    </Stack>
  );
});

export default Card;
