import * as React from 'react';
import FeedPage from '../feed-page/feed-page';
import * as extension from '../extension';

import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-profile';

describe('< FeedPage /> component', () => {
  const BaseComponent = ({ loginState }) => (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage {...genAppProps()} showLoginModal={jest.fn()} loginState={loginState} />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    jest
      .spyOn(extension, 'Extension')
      .mockReturnValue(
        <InlineEditor {...genAppProps()} extensionData={{ name: 'post', action: 'post' }} />,
      );

    (
      jest.spyOn(hooks, 'useGetProfile') as unknown as jest.SpyInstance<{
        status: string;
      }>
    ).mockReturnValue({ status: 'success' });
  });

  it('should render feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent loginState={{ isReady: false, pubKey: null, ethAddress: null }} />,
        {},
      );
    });
    expect(screen.getByText(/Welcome, fellow Ethereans!/i)).toBeInTheDocument();
  });

  it('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={genLoggedInState(true)} />, {});
    });
    expect(screen.getAllByTestId('avatar-image')).not.toBeNull();
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
  });
});
