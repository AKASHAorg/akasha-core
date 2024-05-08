import React from 'react';
import {
  screen,
  renderWithAllProviders,
  act,
  genUser,
  genReflectionData,
} from '@akashaorg/af-testing';
import { PendingReflect } from '../reflect-editor/pending-reflect';

describe('< PendingReflect /> component', () => {
  const reflectionData = genReflectionData();

  const BaseComponent = (
    <PendingReflect
      entryData={{
        ...reflectionData,
        authorId: genUser('did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff').id,
      }}
    />
  );

  it('should show pending reflect', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
    expect(screen.getByText(/Reflection content/i)).toBeInTheDocument();
  });
});
