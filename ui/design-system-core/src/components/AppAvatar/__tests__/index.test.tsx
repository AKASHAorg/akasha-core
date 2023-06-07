import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import { IntegrationTypes } from '@akashaorg/typings/ui';
import AppAvatar from '../';
import { customRender } from '../../../test-utils';

describe('<AppAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const avatar = {
    default: {
      height: 320,
      src: '',
      width: 320,
    },
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
    act(() => componentWrapper.unmount());
    cleanup();
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
