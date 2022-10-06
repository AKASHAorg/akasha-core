import * as React from 'react';
import PostPage from '../post-page/post-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/utils/media-utils';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genLoggedInState,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< PostPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <PostPage {...genAppProps()} showLoginModal={jest.fn()} loginState={genLoggedInState(true)} />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    jest
      .spyOn(hooks, 'getMediaUrl')
      .mockReturnValue({ originLink: '', fallbackLink: '', pathLink: '' });
  });

  it('should render post page', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getAllByTestId('avatar-image')).not.toBeNull();
  });
});
