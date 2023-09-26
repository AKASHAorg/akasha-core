import * as React from 'react';
import { act, screen, renderWithAllProviders } from '@akashaorg/af-testing';
import ListsPage from '../lists-page';

describe('<ListsPage /> component', () => {
  const Base = <ListsPage />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(Base, {});
    });
  });

  it.skip('should render lists page', () => {
    expect(screen.getByText(/You don’t have any saved content in your List/i)).toBeInTheDocument();
  });
});
