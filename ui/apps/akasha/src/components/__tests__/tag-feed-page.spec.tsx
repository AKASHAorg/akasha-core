import * as React from 'react';
import TagFeedPage from '../tag-feed-page/tag-feed-page';

import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< TagFeedPage /> component', () => {
  const BaseComponent = <TagFeedPage showLoginModal={jest.fn()} />;

  beforeAll(() => {
    // (
    //   jest.spyOn(hooks, 'useGetTag') as unknown as jest.SpyInstance<{
    //     data: Record<string, unknown>;
    //     status: 'success' | 'error';
    //   }>
    // ).mockReturnValue({ data: { name: 'my-tag', totalPosts: 10 }, status: 'success' });
  });
  // @TODO fix after new hooks
  it.skip('should render tag feed page', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText(/my-tag/i)).toBeInTheDocument();
    expect(screen.getByText(/10 mentions/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscribe/i)).toBeInTheDocument();
  });
});
