import React from 'react';
import * as queryListnerHooks from '@akashaorg/ui-awf-hooks/lib/use-query-listener';
import * as entryUtilHooks from '@akashaorg/ui-awf-hooks/lib/utils/entry-utils';

import {
  screen,
  renderWithAllProviders,
  act,
  genPendingPost,
  genUser,
} from '@akashaorg/af-testing';
import { PendingReflect } from '../pages/entry-page/pending-reflect';

describe('< PendingReflect /> component', () => {
  const BaseComponent = <PendingReflect beamId="oxfg" loggedProfileData={genUser()} />;

  beforeAll(() => {
    (
      jest.spyOn(queryListnerHooks, 'useMutationsListener') as unknown as jest.SpyInstance<{
        mutations: {
          mutationId: number;
          state: Record<string, unknown>;
        }[];
      }>
    ).mockReturnValue({
      mutations: [{ mutationId: 1, state: { status: 'loading', variables: { postID: 'oxfg' } } }],
    });

    jest.spyOn(entryUtilHooks, 'createPendingEntry').mockReturnValue(genPendingPost());
  });
  // @TODO fix after new hooks
  it.skip('should show pending reflect', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
    expect(screen.getByText('pending post')).toBeInTheDocument();
  });
});
