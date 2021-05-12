import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ErrorLoader from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ErrorLoader /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ErrorLoader
            type="no-login"
            title="No Ethereum address detected"
            details="You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please."
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

  it('renders correct title and detail', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/No Ethereum address detected/i);
    const details = getByText(/No Ethereum /i);

    expect(title).toBeDefined();
    expect(details).toBeDefined();
  });
});
