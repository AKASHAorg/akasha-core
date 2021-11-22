import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletRequestStep from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<WalletRequestStep /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <WalletRequestStep
            walletRequest={async () => {}}
            step={1}
            buttonLabel={'Select address in Wallet'}
            currentStep={1}
            complete={'Done'}
            explanation={'Explanation'}
            heading={'Heading'}
            nextStep={() => {}}
            problem={'Problem'}
            resend={'Resend'}
            textAgain={'Send again'}
            textDeclinedError={'Declined'}
            textNetworkError={'Network'}
            textTimeoutError={'Timeout'}
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

  it('renders heading correctly', () => {
    const { getByText } = componentWrapper;
    const button = getByText('Heading');
    expect(button).toBeDefined();
  });

  it('renders explanation correctly', () => {
    const { getByText } = componentWrapper;
    const button = getByText('Explanation');
    expect(button).toBeDefined();
  });

  it('render button correctly', () => {
    const { getByText } = componentWrapper;
    const button = getByText('Select address in Wallet');
    expect(button).toBeDefined();
  });

  it('responds to click', () => {
    const { getByText } = componentWrapper;
    expect(handleClick).toHaveBeenCalledTimes(0);

    const button = getByText('Select address in Wallet');
    userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
