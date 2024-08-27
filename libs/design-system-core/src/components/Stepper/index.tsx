import React from 'react';
import Stack from '../Stack';
import Icon from '../Icon';
import { CheckIcon } from '@heroicons/react/24/solid';

export type StepperProps = {
  length: number;
  currentStep: number;
};

const Stepper: React.FC<StepperProps> = props => {
  const { length, currentStep } = props;

  const getRingStyle = (index: number): string => {
    if (index < currentStep) return 'bg(secondaryLight dark:secondaryDark)';
    if (index > currentStep) return 'border(2 grey6)';

    return 'border(2 secondaryLight dark:secondaryDark)';
  };

  return (
    <Stack direction="row" align="center">
      {Array.from({ length }, (_, i) => i).map(el => {
        const index = el + 1;
        return (
          <React.Fragment key={el}>
            {index > 1 && (
              <Stack
                customStyle={`w-7 h-[0.1rem] bg(${index > currentStep ? 'grey6' : 'secondaryLight dark:SecondaryDark'})`}
              />
            )}
            <Stack
              direction="row"
              align="center"
              justify="center"
              customStyle={`w-8 h-8 rounded-full ${getRingStyle(index)}`}
            >
              {index < currentStep ? (
                <Icon icon={<CheckIcon />} color="white" solid={true} />
              ) : (
                <Stack
                  background={
                    index > currentStep
                      ? 'grey6'
                      : { light: 'secondaryLight', dark: 'secondaryDark' }
                  }
                  customStyle="w-4 h-4 rounded-full"
                />
              )}
            </Stack>
          </React.Fragment>
        );
      })}
    </Stack>
  );
};

export default Stepper;
