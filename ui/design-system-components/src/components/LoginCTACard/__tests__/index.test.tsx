import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import LoginCTAWidgetCard from '..';

describe('<LoginCTAWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const mailLink = 'mailto:alpha@akasha.world';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <LoginCTAWidgetCard
          title="Welcome, fellow Ethereans! 💫"
          subtitle="We are in private alpha at this time. "
          beforeLinkLabel="If you'd like to participate,just "
          afterLinkLabel="and we'll send you a ticket for the next shuttle going to AKASHA World."
          disclaimerLabel="Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀"
          writeToUsLabel="drop us a message"
          writeToUsUrl={mailLink}
        />,

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

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/Welcome, fellow Ethereans/);
    const subtitle = getByText(/We are in private /);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('has correct mailto link', async () => {
    const { getByRole } = componentWrapper;

    const cta = getByRole('link');
    await userEvent.click(cta);

    expect(cta).toHaveAttribute('href', mailLink);
  });
});
