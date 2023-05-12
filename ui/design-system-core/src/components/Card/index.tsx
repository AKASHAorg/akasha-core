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
  customStyle?: string;
  testId?: string;
  ref?: LegacyRef<HTMLDivElement>;
};

const baseStyles = 'block';

const Card: React.FC<PropsWithChildren<CardProps>> = forwardRef((props, ref) => {
  const {
    elevation = 'none',
    background = { light: 'white', dark: 'grey2' },
    radius,
    padding,
    direction,
    customStyle = '',
    testId,
  } = props;

  const elevationStyle = getElevationClasses(elevation);
  const radiusStyle = getRadiusClasses(radius);
  const paddingStyle = getPaddingClasses(padding);
  const backgroundStyle = getColorClasses(background, 'bg');

  const instanceStyles = apply`
    ${baseStyles}
    ${backgroundStyle}
    ${elevationStyle}
    ${radiusStyle}
    ${paddingStyle}
    ${customStyle}
  `;

  return (
    <Stack direction={direction} customStyle={instanceStyles} testId={testId} ref={ref}>
      {props.children}
    </Stack>
  );
});

export default Card;
