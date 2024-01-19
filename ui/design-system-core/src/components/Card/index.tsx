import React, { PropsWithChildren, forwardRef, LegacyRef } from 'react';
import { apply, tw } from '@twind/core';
import {
  getColorClasses,
  getElevationClasses,
  getPaddingClasses,
  getRadiusClasses,
} from '../../utils';
import { Color, Elevation, Padding, Radius } from '../types/common.types';

type RegularCardType = {
  elevation?: Elevation;
  background?: Color;
  dashedBorder?: boolean;
  accentBorder?: boolean;
  padding?: Padding;
  margin?: string;
  radius?: Radius;
  border?: boolean;
  noBorderRadius?: boolean;
  fullWidth?: boolean;
};

type CommonCardProps = {
  ref?: LegacyRef<HTMLDivElement>;
  testId?: string;
  customStyle?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type TCardProps = CommonCardProps &
  ({ type: 'plain' } | (RegularCardType & { type?: 'regular' }));

const Card: React.FC<PropsWithChildren<TCardProps>> = forwardRef((props, ref) => {
  if (props.type === 'plain') {
    const { testId, customStyle = '', ...rest } = props;
    return (
      <div
        {...rest}
        className={tw(customStyle)}
        role={rest.onClick ? 'button' : 'presentation'}
        ref={ref}
        data-testid={testId}
      >
        {props.children}
      </div>
    );
  }

  return <RegularCard {...props} />;
});

const RegularCard: React.FC<PropsWithChildren<CommonCardProps & RegularCardType>> = forwardRef(
  (props, ref) => {
    const {
      children,
      elevation = '1',
      background = { light: 'white', dark: 'grey2' },
      dashedBorder,
      accentBorder,
      padding = 'p-6',
      margin = 'm-0',
      radius = 'rounded-2xl',
      fullWidth,
      border,
      noBorderRadius,
      customStyle = '',
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
    const fullWidthStyle = fullWidth ? 'w-full' : '';
    const noBorderStyle = noBorderRadius ? 'rounded-none' : radiusStyle;

    const className = apply`flex flex-col ${elevationStyle} w-full ${paddingStyle} ${margin} ${backgroundStyle} ${noBorderStyle} ${generatedBorder} ${fullWidthStyle} ${customStyle}`;

    return (
      <div
        className={tw(className)}
        role={rest.onClick ? 'button' : 'presentation'}
        ref={ref}
        data-testid={testId}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default Card;
