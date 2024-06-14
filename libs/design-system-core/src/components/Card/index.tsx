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
  dataTestId?: string;
  customStyle?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type TCardProps = PropsWithChildren<
  CommonCardProps & ({ type: 'plain' } | (RegularCardType & { type?: 'regular' }))
>;

/**
 * A Card component contains content and actions pertaining to a single subject.
 * There are two types of cards: regular and plain. A regular card looks like a
 * normal card with customizable border and elevation. A plain card doesn't look
 * like a card and can act as an invisible wrapper around other components.
 * @param elevation - (optional) adjust the elevation property
 * @param background - (optional) customize the background color
 * @param dashedBorder - boolean (optional) whether the border should have dashed style
 * @param accentBorder - boolean (optional) whether the border should have accent style
 * @param padding - (optional) customize the padding
 * @param margin - (optional) customize the margin
 * @param radius - (optional) customize the radius
 * @param border - boolean (optional) whether the card should have border
 * @param noBorderRadius - boolean (optional) whether the card should have rounded corner
 * @param fullWidth - boolean (optional) whether the card should occupy the full width of the parent element
 * @param customStyle - (optional) custom styling if any
 * @param dataTestId - (optional) useful identifier when writing tests
 * @param ref - (optional)
 * @example
 * ```tsx
 *  <Card background={{ dark: 'grey3', light: 'grey9' }} onClick={clickHandler} padding="p-4" />
 * ```
 **/
const Card: React.FC<TCardProps> = forwardRef((props, ref) => {
  if (props.type === 'plain') {
    const { dataTestId, customStyle = '', ...rest } = props;
    return (
      <div
        {...rest}
        className={tw(customStyle)}
        role={rest.onClick ? 'button' : 'presentation'}
        ref={ref}
        data-testid={dataTestId}
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
      dataTestId,
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
        data-testid={dataTestId}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default Card;
