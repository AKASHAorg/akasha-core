import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Web3ConnectButton from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Web3ConnectButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Web3ConnectButton
            titleLabel="Connect a Wallet"
            subtitleLabel="Use this option to sign up using your Ethereum wallet. You'll be able to choose which wallet to connect in the next screen."
            leftIconType="wallet"
            handleClick={handleClick}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText('Connect a Wallet');

    expect(titleLabel).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText('Connect a Wallet');
    expect(handleClick).toBeCalledTimes(0);

    userEvent.click(titleLabel);

    expect(handleClick).toBeCalledTimes(1);
  });
});
