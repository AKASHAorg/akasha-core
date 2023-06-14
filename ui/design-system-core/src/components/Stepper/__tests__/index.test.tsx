import * as React from 'react';
import { act } from '@testing-library/react';
import StepIndicator from '../';
import { customRender } from '../../../test-utils';

describe('<StepIndicator /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const stepLabels = [
    'Invitation Code',
    'Legal Agreements',
    'Choose How to Sign Up',
    'Sign Wallet Requests',
    'Choose Username',
  ];

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <StepIndicator activeIndex={3} stepLabels={stepLabels} />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct number of checked steps', () => {
    const { getAllByTestId } = componentWrapper;

    const completedSteps = getAllByTestId('completed-step');

    /**
     * since activeIindex is 3, steps completed will be 3, for indices 0, 1,and 2.
     */
    expect(completedSteps).toHaveLength(3);
  });
});
