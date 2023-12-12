import React, { PropsWithChildren, forwardRef, LegacyRef } from 'react';
import { apply, tw } from '@twind/core';
import {
  getColorClasses,
  getElevationClasses,
  getPaddingClasses,
  getRadiusClasses,
} from '../../utils';
import { Color, Elevation, Padding, Radius } from '../types/common.types';

export type CardProps = {
  elevation?: Elevation;
  background?: Color;
  dashedBorder?: boolean;
  accentBorder?: boolean;
  padding?: Padding;
  margin?: string;
  radius?: Radius;
  border?: boolean;
  noBorderRadius?: boolean;
  customStyle?: string;
  tabIndex?: number;
  ref?: LegacyRef<HTMLDivElement>;
  testId?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Card: React.FC<PropsWithChildren<CardProps>> = forwardRef((props, ref) => {
  const {
    children,
    elevation = '1',
    background = { light: 'white', dark: 'grey2' },
    dashedBorder,
    accentBorder,
    padding = 'p-6',
    margin = 'm-0',
    radius = 'rounded-2xl',
    border,
    noBorderRadius,
    customStyle = '',
    tabIndex = 0,
    testId,
    ...rest
  } = props;

  const generatedBorder = React.useMemo(() => {
    if (dashedBorder) {
      return 'border(2 dashed grey5)';
    }

    if (border) {
      return 'border(1 solid grey9 dark:grey3)';
    }
    if (accentBorder) {
      return 'border(1 solid secondaryLight dark:secondaryDark)';
    }

    /**
     * Define other border-changing props here
     */

    return 'border-none';
  }, [dashedBorder, border, accentBorder]);

  const elevationStyle = getElevationClasses(elevation);
  const radiusStyle = getRadiusClasses(radius);
  const paddingStyle = getPaddingClasses(padding);
  const backgroundStyle = getColorClasses(background, 'bg');

  const className = React.useMemo(
    () =>
      apply`flex flex-col ${elevationStyle} w-full ${paddingStyle} ${margin} ${backgroundStyle} ${
        noBorderRadius ? 'rounded-none' : radiusStyle
      } ${generatedBorder} ${customStyle}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generatedBorder],
  );

  return (
    <div
      className={tw(className)}
      role={rest.onClick ? 'button' : 'presentation'}
      tabIndex={tabIndex}
      ref={ref}
      data-testid={testId}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Card;
