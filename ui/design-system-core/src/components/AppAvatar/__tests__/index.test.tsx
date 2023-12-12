import * as React from 'react';
import { act } from '@testing-library/react';
import { IntegrationTypes } from '@akashaorg/typings/lib/ui';
import AppAvatar from '../';
import { customRender } from '../../../test-utils';

describe('<AppAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const avatar = {
    height: 320,
    src: '',
    width: 320,
  };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <AppAvatar appType={IntegrationTypes.APP} avatar={avatar} />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders avatar fallback for app', () => {
    const { getByRole } = componentWrapper;

    const img = getByRole('img');

    expect(img).toBeDefined();
    expect(img).toHaveAttribute('src', expect.stringMatching(/sidebar-app-placeholder/));
  });
});
