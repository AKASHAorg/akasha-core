import * as React from 'react';
import { tx, cx } from '@twind/core';

export interface IStepIndicatorProps {
  activeIndex: number;
  stepLabels: string[];
}

const IncompletedStepIcon = ({ color = 'grey5', darkColor = 'grey6' }) => {
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
          className={tx(`stroke-${color} dark:stroke-${darkColor}`)}
          strokeWidth="2"
        />
        <circle cx="16" cy="16" r="5" className={tx(`fill-${color} dark:fill-${darkColor}`)} />
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
          className={tx(
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
  const baseHorizontalLineStyle = cx`
    w-20 h-4 border-b-2
    mr-4 md:mr-10
    `;

  const completedHorizontalLineStyle = cx`
    ${baseHorizontalLineStyle}
    border-secondary-light hover:border-secondary-dark dark:border:secondary-dark
    `;
  const incompletedHorizontalLineStyle = cx`
    ${baseHorizontalLineStyle}
    border-grey5 dark:border-grey6
    `;

  return (
    <div className={tx('flex justify-center max-w-fit my-2')}>
      {stepLabels.map((step, idx) => (
        <React.Fragment key={idx + step}>
          <div>
            {idx < activeIndex ? (
              <CompletedStepIcon />
            ) : idx === activeIndex ? (
              <IncompletedStepIcon color="secondary-light" darkColor="secondary-dark" />
            ) : (
              <IncompletedStepIcon />
            )}
          </div>
          {idx !== stepLabels.length - 1 && (
            <div
              className={tx(
                idx < activeIndex ? completedHorizontalLineStyle : incompletedHorizontalLineStyle,
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
