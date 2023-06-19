import * as React from 'react';
import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import ListsPage from '../lists-page';

describe('<ListsPage /> component', () => {
  const Base = <ListsPage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(Base, {});
    });
  });

  it('should render lists page', () => {
    expect(screen.getByText(/You don’t have any saved content in your List/i)).toBeInTheDocument();
  });
});
