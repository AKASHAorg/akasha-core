import React from 'react';
import FeedPage from '../pages/feed-page/feed-page';
import userEvent from '@testing-library/user-event';

import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import {
  screen,
  renderWithAllProviders,
  localStorageMock,
  genAppProps,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';
import { when } from 'jest-when';

const partialArgs = (...argsToMatch) =>
  when.allArgs((args, equals) => equals(args, expect.arrayContaining(argsToMatch)));

const MockedInlineEditor = ({ action }) => (
  <InlineEditor
    extensionData={{
      beamId: '01gf',
      action,
    }}
  />
);

describe('< FeedPage /> component', () => {
  const BaseComponent = () => (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage showLoginModal={jest.fn()} />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    jest
      .fn()
      .mockReturnValue(
        <InlineEditor
          draftStorage={localStorageMock}
          extensionData={{ name: 'inline-editor', action: 'reflect' }}
        />,
      );

    // (
    //   jest.spyOn(hooks, 'useGetProfile') as unknown as jest.SpyInstance<{
    //     status: string;
    //   }>
    // ).mockReturnValue({ status: 'success' });
  });
  // @TODO fix after new hooks
  it.skip('should render feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });
    expect(screen.getByText(/Welcome, fellow Ethereans!/i)).toBeInTheDocument();
  });

  it.skip('should dismiss the notification when close button is clicked', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });
    const closeIcon = screen.queryByTestId('close-icon-alpha-notification');
    expect(closeIcon).toBeDefined();
    if (closeIcon) {
      await userEvent.click(closeIcon);
    }
    expect(screen.queryByText(/Welcome, fellow Ethereans!/i)).not.toBeInTheDocument();
  });

  it.skip('should not display the notification again after close button is clicked', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });
    expect(screen.queryByText(/Welcome, fellow Ethereans!/i)).not.toBeInTheDocument();
  });
  // @TODO fix after sign in works
  it.skip('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });
    expect(screen.getAllByTestId('avatar-image')).not.toBeNull();
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
  });
  // @TODO fix after new hooks
  it.skip('should render repost feed page', async () => {
    //TODO: change URLSearchParams usage on feed page(and elsewhere) with a search param hook and mock the hook here
    history.pushState(null, '', `${location.origin}?repost=oxfceee`);

    const spiedExtension = jest.spyOn(Extension, 'default');

    when(spiedExtension)
      .calledWith(
        partialArgs(
          expect.objectContaining({ name: expect.stringMatching(/inline-editor_repost/) }),
        ),
      )
      .mockReturnValue(<MockedInlineEditor action="repost" />);

    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });

    // expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
    expect(screen.getByTestId('embed-box')).toBeInTheDocument();

    //TODO: change URLSearchParams usage on feed page(and elsewhere) with a search param hook and mock the hook here
    history.pushState(null, '', location.origin);
  });
  it.skip('should show saved draft post', async () => {
    // const loginState = genLoggedInState(true);

    // localStorageMock.setItem(
    //   Draft.getDraftKey(appProps?.worldConfig?.homepageApp, loginState?.id, 'post'),
    //   JSON.stringify([
    //     {
    //       type: 'paragraph',
    //       children: [
    //         {
    //           text: 'Post in progress ...',
    //         },
    //       ],
    //     },
    //   ]),
    // );
    await act(async () => {
      renderWithAllProviders(<BaseComponent />, {});
    });

    expect(screen.getByText(/Post in progress .../i)).toBeInTheDocument();
    expect(screen.getByText(/Draft/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  // it('should clear draft post', async () => {
  //   const loginState = genLoggedInState(true);
  //   localStorageMock.setItem(
  //     Draft.getDraftKey(appProps?.worldConfig?.homepageApp, loginState?.id, 'post'),
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
