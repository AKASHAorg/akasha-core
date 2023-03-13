import React, { PropsWithChildren } from 'react';
import Stack from '../Stack';
import { tw } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';
import { arcCommands, calculateEndAngle } from '../../utils/graphics';
import { MeterProps } from './types';

const Circle: React.FC<PropsWithChildren<MeterProps>> = ({
  size,
  thickness,
  value,
  children,
  max = 100,
  progressBg,
  background,
}) => {
  const progressStyle = getColorClasses(progressBg || 'text-black');
  const backgroundStyle = getColorClasses(background || 'text-grey8');

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
    <Stack justify="center" align="center" customStyle="inline-flex overflow-hidden">
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
      <div className="absolute"> {children} </div>
    </Stack>
  );
};

export default Circle;
