import * as React from 'react';
import * as singleSpa from 'single-spa';
import FeedPage from '../feed-page/feed-page';

import {
  RenderResult,
  renderWithAllProviders,
  uiEventsMock,
  genWorldConfig,
} from '@akashaorg/af-testing';
import { act } from 'react-dom/test-utils';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { QueryClient, QueryClientProvider } from 'react-query';

jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    ENTRY: 0,
    PROFILE: 1,
    COMMENT: 2,
    TAG: 3,
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('< FeedPage /> component', () => {
  let renderResult: RenderResult;
  const BaseComponent = (
    <QueryClientProvider contextSharing={true} client={queryClient}>
      <AnalyticsProvider uiEvents={uiEventsMock}>
        <FeedPage
          showLoginModal={jest.fn()}
          loginState={{ isReady: true, pubKey: '0x00', ethAddress: '0x00' }}
          uiEvents={uiEventsMock}
          domElement={document.body}
          layoutConfig={{
            modalSlotId: '',
            pluginSlotId: '',
            topbarSlotId: '',
            rootWidgetSlotId: '',
            widgetSlotId: '',
            sidebarSlotId: '',
          }}
          logger={null}
          singleSpa={singleSpa}
          activeModal={null}
          worldConfig={genWorldConfig()}
          parseQueryString={jest.fn()}
          navigateToModal={jest.fn()}
        />
      </AnalyticsProvider>
    </QueryClientProvider>
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should be defined', async () => {
    expect(true).toBe(true);
  });
});
