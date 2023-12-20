import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

import Stack from '../Stack';

import { getColorClasses } from '../../utils';
import { MeterProps } from '.';

const Bar: React.FC<PropsWithChildren<MeterProps>> = ({
  size,
  thickness,
  value,
  children,
  max = 100,
  progressBg,
  background,
  direction = 'horizontal',
  customStyle = '',
}) => {
  const progressStyle = getColorClasses(progressBg || 'black', 'stroke');
  const backgroundStyle = getColorClasses(background || 'grey8', 'stroke');
  const capOffset = 0;
  const mid = thickness / 2;
  const start = direction === 'horizontal' ? capOffset : (max * (size - 2 * capOffset)) / max;
  const delta = (value * (size - 2 * capOffset)) / max;
  const d =
    direction === 'horizontal'
      ? `M ${start},${mid} L ${start + delta},${mid}`
      : `M ${mid},${start} L ${mid},${start - delta}`;
  const backgroundPath =
    direction === 'horizontal'
      ? `M ${capOffset},${mid} L ${size - capOffset},${mid}`
      : `M ${mid},${capOffset} L ${mid},${size - capOffset}`;

  return (
    <Stack
      justify="center"
      align="center"
      customStyle={`relative inline-flex overflow-hidden ${customStyle}`}
    >
      <svg
        viewBox={
          direction === 'horizontal' ? `0 0 ${size} ${thickness}` : `0 0 ${thickness} ${size}`
        }
        preserveAspectRatio="none"
        width={direction === 'horizontal' ? size : thickness}
        height={direction === 'horizontal' ? thickness : size}
      >
        <path
          className={tw(backgroundStyle)}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="square"
          d={backgroundPath}
        />
        <path
          className={tw(progressStyle)}
          strokeWidth={direction === 'horizontal' ? thickness : size}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="butt"
          d={d}
        />
      </svg>
      <div className={tw('absolute')}> {children} </div>
    </Stack>
  );
};

export default Bar;
