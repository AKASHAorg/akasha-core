import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

import Stack from '../Stack';

import { MeterProps } from '.';

import { getColorClasses, calculateEndAngle, arcCommands } from '../../utils';

const Circle: React.FC<PropsWithChildren<MeterProps>> = ({
  size,
  thickness,
  value,
  children,
  max = 100,
  progressBg,
  background,
  customStyle = '',
}) => {
  const progressStyle = getColorClasses(progressBg || 'black', 'stroke');
  const backgroundStyle = getColorClasses(background || 'grey8', 'stroke');

  if (size < 0 || thickness < 0 || value < 0) {
    throw Error('Invalid prop ...');
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - thickness / 2;

  const scalePower = Math.max(5, Math.ceil(Math.log10(max)) + 3);
  const scale = 10 ** scalePower;

  const anglePer = Math.floor((360 / max) * scale) / scale;

  const startAngle = 0;
  let endAngle;
  if (value >= max) {
    endAngle = 360;
  } else {
    endAngle = calculateEndAngle(startAngle, anglePer, value);
  }

  const d = arcCommands(centerX, centerY, radius, startAngle, endAngle);

  return (
    <Stack
      justify="center"
      align="center"
      customStyle={`relative inline-flex overflow-hidden ${customStyle}`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle
          className={tw(backgroundStyle)}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={centerX}
          cy={centerY}
        />
        <path
          className={tw(`${progressStyle}`)}
          d={d}
          strokeWidth={thickness}
          strokeLinecap="butt"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className={tw('absolute')}> {children} </div>
    </Stack>
  );
};

export default Circle;
