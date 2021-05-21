import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

import TagCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';
import userEvent from '@testing-library/user-event';

describe('<TagCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSubscribe = jest.fn();
  const handleUnsubscribe = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TagCard
            tag={trendingTagsData[0]}
            handleSubscribe={handleSubscribe}
            handleUnsubscribe={handleUnsubscribe}
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

  it('has correct tag name', () => {
    const { getByText } = componentWrapper;
    const akashaTag = getByText('AKASHA');

    expect(akashaTag).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByRole } = componentWrapper;
    const subscribedButton = getByRole('button', { name: 'Subscribed' });

    expect(handleSubscribe).toBeCalledTimes(0);

    userEvent.click(subscribedButton);
    expect(handleSubscribe).toBeCalledTimes(1);
  });
});
