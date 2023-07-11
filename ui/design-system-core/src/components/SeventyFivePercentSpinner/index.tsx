import React from 'react';
import { tw, apply } from '@twind/core';
import { Color } from '../types/common.types';
import { getColorClasses } from '../../utils/getColorClasses';

export interface ISpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  color?: Color;
  loadingLabel: string;
}

const spinnerSizesMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  xxl: 'w-24 h-24',
};

const SeventyFivePercentSpinner: React.FC<ISpinnerProps> = props => {
  const { size = 'md', color = 'black', loadingLabel } = props;

  return (
    <div
      role="status"
      className={tw(
        apply(
          `inline-block ${
            spinnerSizesMap[size]
          } animate-spin rounded-full border-4 border-solid ${getColorClasses(
            color,
            'border',
          )} border-r-transparent dark:border-r-white align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`,
        ),
      )}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        {loadingLabel}
      </span>
    </div>
  );
};

export default SeventyFivePercentSpinner;
