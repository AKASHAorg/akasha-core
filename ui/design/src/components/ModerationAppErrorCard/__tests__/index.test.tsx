import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ModerationAppErrorCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ModerationAppErrorCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ModerationAppErrorCard
            boxSize="18.75rem"
            errorType="no-authentication"
            titleLabel="This page is restricted to Ethereum World Moderators"
            subtitleLabel="To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue."
            buttonLabel="Connect a wallet"
            textMarginBottom={true}
            hasButton={true}
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
    const title = getByText(/This page is/);
    const details = getByText(/To view this page/);

    expect(title).toBeDefined();
    expect(details).toBeDefined();
  });

  it('renders an image with correct src', () => {
    const { getByRole } = componentWrapper;
    const image = getByRole('img');

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', '/images/no-authentication.png');
  });

  it('has a call to action button', () => {
    const { getByRole } = componentWrapper;

    const ctaButton = getByRole('button', { name: 'Connect a wallet' });
    expect(ctaButton).toBeDefined();
  });
});
