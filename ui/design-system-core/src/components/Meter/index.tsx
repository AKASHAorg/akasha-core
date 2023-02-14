import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';
import { Color } from '../types/common.types';
import { arcCommands, calculateEndAngle } from '../../utils/graphics';

export type MeterProps = {
  size: number;
  thickness: number;
  value: number;
  max?: number;
  progressBg?: Color;
  background?: Color;
};

const Meter: React.FC<PropsWithChildren<MeterProps>> = ({
  size,
  thickness,
  value,
  children,
  max = 100,
  progressBg,
  background,
}) => {
  const progressStyles = getColorClasses(progressBg || 'text-black');
  const backgroundStyles = getColorClasses(background || 'text-grey8');

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
    <div className={tw(apply`inline-flex items-center justify-center overflow-hidden]`)}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle
          className={tw(apply(backgroundStyles))}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={centerX}
          cy={centerY}
        />
        <path
          className={tw(apply(`${progressStyles}`))}
          d={d}
          strokeWidth={thickness}
          strokeLinecap="butt"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className="absolute"> {children} </div>
    </div>
  );
};

export default Meter;
