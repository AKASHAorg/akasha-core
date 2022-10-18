import * as React from 'react';
import PostPage from '../post-page/post-page';
import * as extension from '../extension';
import * as profileHooks from '@akashaorg/ui-awf-hooks/lib/use-profile';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genLoggedInState,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import { when } from 'jest-when';

const partialArgs = (...argsToMatch) =>
  when.allArgs((args, equals) => equals(args, expect.arrayContaining(argsToMatch)));

const MockedInlineEditor = ({ action }) => (
  <InlineEditor
    {...genAppProps()}
    extensionData={{
      name: 'name',
      entryId: '01gf',
      isShown: true,
      action,
    }}
  />
);

describe('< PostPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <PostPage {...genAppProps()} showLoginModal={jest.fn()} loginState={genLoggedInState(true)} />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    (
      jest.spyOn(profileHooks, 'useGetProfile') as unknown as jest.SpyInstance<{
        data: Record<string, unknown>;
        status: string;
      }>
    ).mockReturnValue({ data: genLoggedInState(true), status: 'success' });
  });

  it('should render post page', async () => {
    const spiedExtension = jest.spyOn(extension, 'Extension');

    when(spiedExtension)
      .calledWith(partialArgs(expect.objectContaining({ name: 'inline-editor_postreply' })))
      .mockReturnValue(<MockedInlineEditor action="reply" />);

    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText(/Reply to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reply/i })).toBeInTheDocument();
  });

  it('should render repost page', async () => {
    history.pushState(null, '', `${location.origin}?action=repost`);

    const spiedExtension = jest.spyOn(extension, 'Extension');

    when(spiedExtension)
      .calledWith(partialArgs(expect.objectContaining({ name: 'inline-editor_repost' })))
      .mockReturnValue(<MockedInlineEditor action="embed" />);

    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
    expect(screen.getByTestId('embed-box')).toBeInTheDocument();
  });

  it('should render edit page', async () => {
    history.pushState(null, '', `${location.origin}?action=edit`);

    const spiedExtension = jest.spyOn(extension, 'Extension');

    when(spiedExtension)
      .calledWith(partialArgs(expect.objectContaining({ name: 'inline-editor_postedit' })))
      .mockReturnValue(<MockedInlineEditor action="edit" />);

    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });
});
