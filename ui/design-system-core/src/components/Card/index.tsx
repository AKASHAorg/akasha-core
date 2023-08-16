import React, { PropsWithChildren, forwardRef, LegacyRef } from 'react';
import { apply, tw } from '@twind/core';
import { getColorClasses, getElevationClasses, getRadiusClasses } from '../../utils';
import { Color, Elevation, Radius } from '../types/common.types';

export type CardProps = {
  elevation?: Elevation;
  background?: Color;
  dashedBorder?: boolean;
  accentBorder?: boolean;
  padding?: string;
  margin?: string;
  radius?: Radius;
  border?: boolean;
  noBorderRadius?: boolean;
  customStyle?: string;
  onClick?: () => void;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  ref?: LegacyRef<HTMLDivElement>;
  testId?: string;
};

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
    onKeyDown = () => {
      void 0;
    },
    onClick,
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
  const backgroundStyle = getColorClasses(background, 'bg');

  const className = React.useMemo(
    () =>
      apply`flex flex-col ${elevationStyle} w-full ${padding} ${margin} ${backgroundStyle} ${
        noBorderRadius ? 'rounded-none' : radiusStyle
      } ${generatedBorder} ${customStyle}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generatedBorder],
  );

  return (
    <div
      className={tw(className)}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={tabIndex}
      ref={ref}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-testid={testId}
    >
      {children}
    </div>
  );
});

export default Card;
