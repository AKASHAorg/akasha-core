import * as React from 'react';
import * as queryListnerHooks from '@akashaorg/ui-awf-hooks/lib/use-query-listener';
import * as entryUtilHooks from '@akashaorg/ui-awf-hooks/lib/utils/entry-utils';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genPendingPost,
  genUser,
} from '@akashaorg/af-testing';
import { PendingEntry } from '../post-page/pending-entry';

describe('< PendingEntry /> component', () => {
  const BaseComponent = (
    <PendingEntry postId="oxfg" {...genAppProps()} loggedProfileData={genUser()} />
  );

  beforeAll(() => {
    (
      jest.spyOn(queryListnerHooks, 'useMutationsListener') as unknown as jest.SpyInstance<
        {
          mutationId: number;
          state: Record<string, unknown>;
        }[]
      >
    ).mockReturnValue([
      { mutationId: 1, state: { status: 'loading', variables: { postID: 'oxfg' } } },
    ]);

    jest.spyOn(entryUtilHooks, 'createPendingEntry').mockReturnValue(genPendingPost());
  });

  it('should show pending reply', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText('pending post')).toBeInTheDocument();
    expect(screen.getByTestId('pending-entry').style.backgroundColor).toBe(
      'rgba(78, 113, 255, 0.059)',
    );
  });
});
