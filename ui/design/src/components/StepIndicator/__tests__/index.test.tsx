import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import StepIndicator from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<StepIndicator /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <StepIndicator
            activeIndex={1}
            stepLabels={[
              'Invitation Code',
              'Legal Agreements',
              'Choose How to Sign Up',
              'Sign Wallet Requests',
              'Choose Username',
            ]}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
