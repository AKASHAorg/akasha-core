import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import SignUpCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<SignUpCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleIconClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SignUpCard
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
          </SignUpCard>,
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
