import * as React from 'react';
import FeedPage from '../feed-page/feed-page';
import * as extension from '@akashaorg/design-system/lib/utils/extension';

import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
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
      entryId: '01gf',
      entryType: EntityTypes.ENTRY,
      action,
    }}
  />
);

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

  it('should render repost feed page', async () => {
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

    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
    expect(screen.getByTestId('embed-box')).toBeInTheDocument();
  });
});
