import React from 'react';
import ReflectionPage from '../pages/entry-page/reflection-page';
import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genReflectionData,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
}

describe('< ReflectionPage /> component', () => {
  global.ResizeObserver = ResizeObserver;
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <ReflectionPage
        reflection={{ node: genReflectionData() }}
        reflectionId={'kjzl6kcym7w8y5coci0at0tquy8zmferlog99ys94oj2qgyjy8soxzpbflmlzey'}
        isLoggedIn={true}
      />
    </AnalyticsProvider>
  );

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it.skip('should render reflection page', async () => {
    expect(screen.getByText(/Back to original beam/i)).toBeInTheDocument();
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reflect/i })).toBeInTheDocument();
  });
});
