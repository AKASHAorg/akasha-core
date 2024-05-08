import React from 'react';
import { tx } from '@twind/core';

//Not imported into Icon because this one has both stroke and fill color that needs to be specified for both circles
const StepIndicatorIncompletedStep = ({ colorLight = 'grey5', colorDark = 'grey6' }) => {
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
          className={tx(`stroke-${colorLight} dark:stroke-${colorDark}`)}
          strokeWidth="2"
        />
        <circle cx="16" cy="16" r="5" className={tx(`fill-${colorLight} dark:fill-${colorDark}`)} />
      </svg>
    </div>
  );
};

export default StepIndicatorIncompletedStep;
