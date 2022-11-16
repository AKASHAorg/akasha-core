import * as React from 'react';
import FeedPage from '../feed-page/feed-page';
import * as extension from '@akashaorg/design-system/lib/utils/extension';
import userEvent from '@testing-library/user-event';

import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
  localStorageMock,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-profile';

const appProps = genAppProps();
describe('< FeedPage /> component', () => {
  const BaseComponent = ({ loginState }) => (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage {...appProps} showLoginModal={jest.fn()} loginState={loginState} />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    jest
      .spyOn(extension, 'Extension')
      .mockReturnValue(
        <InlineEditor
          {...genAppProps()}
          draftStorage={localStorageMock}
          extensionData={{ name: 'post', action: 'post' }}
        />,
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

  it('should show saved draft post', async () => {
    const loginState = genLoggedInState(true);
    localStorageMock.setItem(
      `${appProps?.worldConfig?.homepageApp}-${loginState.pubKey}-draft-item`,
      JSON.stringify([
        {
          type: 'paragraph',
          children: [
            {
              text: 'Post in progress ...',
            },
          ],
        },
      ]),
    );
    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={loginState} />, {});
    });

    expect(screen.getByText(/Post in progress .../i)).toBeInTheDocument();
    expect(screen.getByText(/Draft/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  it('should clear draft post', async () => {
    const loginState = genLoggedInState(true);
    localStorageMock.setItem(
      `${appProps?.worldConfig?.homepageApp}-${loginState.pubKey}-draft-item`,
      JSON.stringify([
        {
          type: 'paragraph',
          children: [
            {
              text: 'Post in progress ...',
            },
          ],
        },
      ]),
    );
    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={loginState} />, {});
    });

    await userEvent.click(screen.getByText(/Clear/i));

    expect(Object.keys(localStorageMock.getAll()).length).toBe(0);
  });
});
