import * as React from 'react';
import FeedPage from '../feed-page/feed-page';
import * as extension from '@akashaorg/design-system/lib/utils/extension';
import userEvent from '@testing-library/user-event';

import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import { Draft } from '../../extensions/inline-editor/utils/draft';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
  localStorageMock,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';
import { when } from 'jest-when';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-profile';
import { EntityTypes } from '@akashaorg/typings/ui';

const partialArgs = (...argsToMatch) =>
  when.allArgs((args, equals) => equals(args, expect.arrayContaining(argsToMatch)));

const MockedInlineEditor = ({ action }) => (
  <InlineEditor
    {...genAppProps()}
    extensionData={{
      name: 'name',
      itemId: '01gf',
      itemType: EntityTypes.POST,
      action,
    }}
  />
);

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

  it('should dismiss the notification when close button is clicked', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent loginState={{ isReady: false, pubKey: null, ethAddress: null }} />,
        {},
      );
    });
    const closeIcon = screen.queryByTestId('close-icon-alpha-notification');
    expect(closeIcon).toBeDefined();
    if (closeIcon) {
      await userEvent.click(closeIcon);
    }
    expect(screen.queryByText(/Welcome, fellow Ethereans!/i)).not.toBeInTheDocument();
  });

  it('should not display the notification again after close button is clicked', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent loginState={{ isReady: false, pubKey: null, ethAddress: null }} />,
        {},
      );
    });
    expect(screen.queryByText(/Welcome, fellow Ethereans!/i)).not.toBeInTheDocument();
  });

  it('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={genLoggedInState(true)} />, {});
    });
    expect(screen.getAllByTestId('avatar-image')).not.toBeNull();
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
  });

  it('should render repost feed page', async () => {
    //TODO: change URLSearchParams usage on feed page(and elsewhere) with a search param hook and mock the hook here
    history.pushState(null, '', `${location.origin}?repost=oxfceee`);

    const spiedExtension = jest.spyOn(extension, 'Extension');

    when(spiedExtension)
      .calledWith(
        partialArgs(
          expect.objectContaining({ name: expect.stringMatching(/inline-editor_repost/) }),
        ),
      )
      .mockReturnValue(<MockedInlineEditor action="repost" />);

    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={genLoggedInState(true)} />, {});
    });

    // expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
    expect(screen.getByTestId('embed-box')).toBeInTheDocument();

    //TODO: change URLSearchParams usage on feed page(and elsewhere) with a search param hook and mock the hook here
    history.pushState(null, '', location.origin);
  });
  it.skip('should show saved draft post', async () => {
    const loginState = genLoggedInState(true);

    localStorageMock.setItem(
      Draft.getDraftKey(appProps?.worldConfig?.homepageApp, loginState.pubKey, 'post'),
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

  // it('should clear draft post', async () => {
  //   const loginState = genLoggedInState(true);
  //   localStorageMock.setItem(
  //     Draft.getDraftKey(appProps?.worldConfig?.homepageApp, loginState.pubKey, 'post'),
  //     JSON.stringify([
  //       {
  //         type: 'paragraph',
  //         children: [
  //           {
  //             text: 'Post in progress ...',
  //           },
  //         ],
  //       },
  //     ]),
  //   );
  //   await act(async () => {
  //     renderWithAllProviders(<BaseComponent loginState={loginState} />, {});
  //   });

  //   await userEvent.click(screen.getByText(/Clear/i));

  //   expect(Object.keys(localStorageMock.getAll()).length).toBe(0);
  // });
});
