import * as React from 'react';
import PostPage from '../item-page/post-page';
import * as Extension from '@akashaorg/design-system-components/lib/components/Extension';
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

describe('< PostPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <PostPage {...genAppProps()} showLoginModal={jest.fn()} />
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

  // @TODO fix after replacing hooks
  it.skip('should render post page', async () => {
    const spiedExtension = jest.spyOn(Extension, 'default');

    when(spiedExtension)
      .calledWith(
        partialArgs(
          expect.objectContaining({ name: expect.stringMatching(/inline-editor_reply/) }),
        ),
      )
      .mockReturnValue(<MockedInlineEditor action="reply" />);

    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    // expect(screen.getByText(/Reply to/i)).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /Reply/i })).toBeInTheDocument();
  });
  // it('should render reply fragment with view all replies link', async () => {
  //   await act(async () => {
  //     renderWithAllProviders(BaseComponent, {});
  //   });

  //   expect(screen.getByTestId('reply-fragment')).toBeInTheDocument();
  //   expect(screen.getByText(/View all replies/)).toBeInTheDocument();
  // });
  // it('should render edit page', async () => {
  //   history.pushState(null, '', `${location.origin}?action=edit`);

  //   const spiedExtension = jest.spyOn(extension, 'Extension');

  //   when(spiedExtension)
  //     .calledWith(
  //       partialArgs(
  //         expect.objectContaining({ name: expect.stringMatching(/inline-editor_postedit/) }),
  //       ),
  //     )
  //     .mockReturnValue(<MockedInlineEditor action="edit" />);

  //   await act(async () => {
  //     renderWithAllProviders(BaseComponent, {});
  //   });

  //   expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  // });
});
