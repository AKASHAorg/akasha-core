import * as React from 'react';
import { tx, cx } from '@twind/core';
import IncompletedStepIcon from '../Icon/akasha-icons/StepIndicatorIncompleteStep';
import CompletedStepIcon from '../Icon/akasha-icons/StepIndicatorCompletedStep';

export interface IStepIndicatorProps {
  activeIndex: number;
  stepLabels: string[];
}

const StepIndicator: React.FC<IStepIndicatorProps> = ({ stepLabels, activeIndex }) => {
  const baseHorizontalLineStyle = cx`w-20 h-4 border-b-2`;

  const completedHorizontalLineStyle = cx`
    ${baseHorizontalLineStyle}
    border(secondaryLight dark:secondaryDark)
    `;
  const incompletedHorizontalLineStyle = cx`
    ${baseHorizontalLineStyle}
    border(grey5 dark:grey6)
    `;

  return (
    <div className={tx('flex justify-center max-w-fit my-2')}>
      {stepLabels.map((step, idx) => (
        <React.Fragment key={idx + step}>
          <div>
            {idx < activeIndex ? (
              <CompletedStepIcon />
            ) : idx === activeIndex ? (
              <IncompletedStepIcon colorLight="secondaryLight" colorDark="secondaryDark" />
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
