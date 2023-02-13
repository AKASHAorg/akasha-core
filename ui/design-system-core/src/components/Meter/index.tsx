import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';
import { Color } from '../types/common.types';

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
  const progressStyles = progressBg ? getColorClasses(progressBg) : 'text-black';
  const backgroundStyles = background ? getColorClasses(background) : 'text-grey8';

  if (size < 0 || thickness < 0 || value < 0) {
    throw Error('Invalid prop ...');
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - thickness / 2;
  const circumference = size * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

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
        <circle
          className={tw(apply(`${progressStyles} -rotate-90 origin-center`))}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset < 0 ? 0 : strokeDashoffset}
          strokeLinecap="butt"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={centerX}
          cy={centerY}
        />
      </svg>
      <div className="absolute"> {children} </div>
    </div>
  );
};

export default Meter;
