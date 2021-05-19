import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginCTAWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<LoginCTAWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <LoginCTAWidgetCard
            title="🚀 Welcome to Ethereum World!"
            subtitle="We are in private alpha at this time. "
            beforeLinkLabel="If you'd like to participate,"
            afterLinkLabel="and we'll add you to our waitlist!"
            writeToUsLabel="write to us"
            writeToUsUrl="mailto:alpha@ethereum.world"
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

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/Welcome to /);
    const subtitle = getByText(/We are in private /);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('has correct mailto link', () => {
    const { getByRole } = componentWrapper;

    const cta = getByRole('link', { name: 'write to us' });
    userEvent.click(cta);

    expect(cta).toHaveAttribute('href', 'mailto:alpha@ethereum.world');
  });
});
