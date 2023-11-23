import React from 'react';
import * as queryListnerHooks from '@akashaorg/ui-awf-hooks/lib/use-query-listener';

import {
  screen,
  renderWithAllProviders,
  act,
  genUser,
  genReflectionData,
} from '@akashaorg/af-testing';
import { PendingReflect } from '../pages/entry-page/pending-reflect';

describe('< PendingReflect /> component', () => {
  const reflectionData = genReflectionData();

  const BaseComponent = (
    <PendingReflect beamId={reflectionData.beamID} loggedProfileData={genUser()} />
  );

  beforeAll(() => {
    (
      jest.spyOn(queryListnerHooks, 'useMutationsListener') as unknown as jest.SpyInstance<{
        mutations: {
          mutationId: number;
          state: Record<string, unknown>;
        }[];
      }>
    ).mockReturnValue({
      mutations: [
        {
          mutationId: 1,
          state: {
            status: 'loading',
            variables: { i: { content: { ...reflectionData } } },
          },
        },
      ],
    });
  });
  it('should show pending reflect', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
    expect(screen.getByText(/Reflection content/i)).toBeInTheDocument();
  });
});
