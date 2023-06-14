import React from 'react';
import { tx } from '@twind/core';

//Not imported into Icon because this one is a solid check circle icon, not outline icon
const StepIndicatorCompletedStep = () => {
  return (
    <div data-testid="completed-step">
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
            `fill-secondaryLight hover:fill-secondaryDark dark:(fill-secondaryDark hover:fill-secondaryLight)`,
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

export default StepIndicatorCompletedStep;
