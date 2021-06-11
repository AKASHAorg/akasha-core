import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import NotificationPill from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { userData } from '../../../utils/dummy-data';

describe('<NotificationPill /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleDismiss = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <NotificationPill
            infoLabel="New posts recently published"
            userData={userData}
            handleDismiss={handleDismiss}
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

  it('has correct info label', () => {
    const { getByText } = componentWrapper;
    const infoLabel = getByText(/New posts /);

    expect(infoLabel).toBeDefined();
  });

  it('has three avatars', () => {
    const { getAllByRole } = componentWrapper;

    const avatars = getAllByRole('img');
    expect(avatars).toHaveLength(3);
  });
});
