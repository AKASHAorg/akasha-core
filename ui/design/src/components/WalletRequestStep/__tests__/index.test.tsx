import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletRequestStep from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe.skip('<WalletRequestStep /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <WalletRequestStep
            walletRequest={async () => null}
            pending={false}
            completed={false}
            buttonLabel={'Select address in Wallet'}
            complete={'Done'}
            explanation={'Explanation'}
            heading={'Heading'}
            problem={'Problem'}
            resend={'Resend'}
            textAgain={'Send again'}
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

  it('renders button correctly', () => {
    const { getByText } = componentWrapper;
    const button = getByText('Select address in Wallet');
    expect(button).toBeDefined();
  });

  it('responds to click', async () => {
    const { getByText } = componentWrapper;
    expect(handleClick).toHaveBeenCalledTimes(0);

    const button = getByText('Select address in Wallet');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
