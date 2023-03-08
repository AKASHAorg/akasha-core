import * as React from 'react';
import { apply, tw } from '@twind/core';

import Icon from '../Icon';
import RadioButton from '../RadioButton';
import Checkbox from '../Checkbox';

export interface IStepIndicatorProps {
  activeIndex: number;
  stepLabels: string[];
}

const UncompletedStepIcon = ({ color = 'grey5', darkColor = 'grey6' }) => {
  return (
    <div>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="16"
          r="15"
          className={tw(`stroke-${color} dark:stroke-${darkColor}`)}
          strokeWidth="2"
        />
        <circle cx="16" cy="16" r="5" className={tw(`fill-${color} dark:fill-${darkColor}`)} />
      </svg>
    </div>
  );
};

const CompletedStepIcon = () => {
  return (
    <div>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="16"
          r="16"
          className={tw(
            `fill-secondary-light hover:fill-secondary-dark dark:fill-secondary-dark dark:hover:fill-secondary-light`,
          )}
        />
        <path
          d="M10.1667 16.8333L13.5 20.1667L21.8333 11.8333"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const StepIndicator: React.FC<IStepIndicatorProps> = ({ stepLabels, activeIndex }) => {
  return (
    <div className={tw('flex justify-center max-w-fit my-2')}>
      {stepLabels.map((step, idx) => (
        <React.Fragment key={idx + step}>
          <div>
            {idx < activeIndex ? (
              <CompletedStepIcon />
            ) : idx === activeIndex ? (
              <UncompletedStepIcon color={tw('secondary-light')} darkColor={tw('secondary-dark')} />
            ) : (
              <UncompletedStepIcon />
            )}
          </div>
          {idx !== stepLabels.length - 1 && (
            <div
              className={tw(
                `w-20 h-4 border(b-2 ${
                  idx < activeIndex
                    ? 'secondary-light hover:secondary-dark dark:secondary-dark'
                    : 'grey5 dark:grey6'
                }) mr-4 md:mr-10`,
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
