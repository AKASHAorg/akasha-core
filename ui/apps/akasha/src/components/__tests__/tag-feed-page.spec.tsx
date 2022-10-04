import * as React from 'react';
import TagFeedPage from '../tag-feed-page/tag-feed-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-tag';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< TagFeedPage /> component', () => {
  const BaseComponent = (
    <TagFeedPage
      {...genAppProps()}
      showLoginModal={jest.fn()}
      loginState={{ isReady: false, pubKey: '', ethAddress: '' }}
    />
  );

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetTag') as unknown as jest.SpyInstance<{
        data: Record<string, unknown>;
        status: 'success' | 'error';
      }>
    ).mockReturnValue({ data: { name: 'my-tag', totalPosts: 10 }, status: 'success' });
  });

  it('should render tag feed page', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText(/my-tag/i)).toBeInTheDocument();
    expect(screen.getByText(/10 mentions/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscribe/i)).toBeInTheDocument();
  });
});
