import * as React from 'react';
import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import BookmarksPage from '../bookmarks-page';

describe('<BookmarksPage /> component', () => {
  const Base = <BookmarksPage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(Base, {});
    });
  });

  it('should render bookmarks page', () => {
    expect(
      screen.getByText(/Bookmarks help you save your favorite posts for quick access at any time./),
    ).toBeInTheDocument();
  });
});
