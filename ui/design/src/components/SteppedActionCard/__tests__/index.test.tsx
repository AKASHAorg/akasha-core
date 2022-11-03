import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import SteppedActionCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<SteppedActionCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleIconClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SteppedActionCard
            titleLabel="Sign Up"
            activeIndex={1}
            stepLabels={[
              'Invitation Code',
              'Legal Agreements',
              'Choose How to Sign Up',
              'Sign Wallet Requests',
              'Choose Username',
            ]}
            handleIconClick={handleIconClick}
          >
            {<></>}
          </SteppedActionCard>,
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
