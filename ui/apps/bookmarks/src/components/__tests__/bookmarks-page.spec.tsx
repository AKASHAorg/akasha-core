import * as React from 'react';
import { act, screen, renderWithAllProviders } from '@akashaorg/af-testing';
import BookmarksPage from '../bookmarks-page';

// jest
//   .spyOn(FeedWidget, 'default')
//   .mockImplementation(({ pages }) => <>{pages && <div>Post Placeholder</div>}</>);
describe('<BookmarksPage /> component', () => {
  const Base = (
    <BookmarksPage
      logger={{}}
      navigateToModal={jest.fn()}
      uiEvents={{}}
      layoutConfig={{}}
      singleSpa={{}}
      worldConfig={{}}
      parseQueryString={jest.fn as any}
      plugins={{}}
    />
  );

  beforeEach(async () => {
    await act(async () => {
      await renderWithAllProviders(Base, {});
    });
  });

  it('should show `Bookmarks help you save your favorite posts for quick access at any time.` for non logged in user', () => {
    expect(
      screen.getByText('Bookmarks help you save your favorite posts for quick access at any time.'),
    ).toBeInTheDocument();
  });
});
