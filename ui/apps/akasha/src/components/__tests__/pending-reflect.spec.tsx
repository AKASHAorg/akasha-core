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
    <PendingReflect entryData={{ ...reflectionData, authorId: genUser().id }} />
  );

  it('should show pending reflect', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
    expect(screen.getByText(/Reflection content/i)).toBeInTheDocument();
  });
});
