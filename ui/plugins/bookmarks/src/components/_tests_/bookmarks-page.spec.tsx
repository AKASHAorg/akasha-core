import * as React from 'react';
import BookmarksPage from '../bookmarks-page';
import {
  RenderResult,
  renderWithAllProviders,
  globalChannelMock,
  getSDKMocks,
  act,
} from '@akashaproject/ui-awf-testing-utils';

describe('<BookmarksPage /> component', () => {
  let renderResult: RenderResult;
  const sdkMocks = getSDKMocks({});
  const Base = (
    <BookmarksPage
      sdkModules={sdkMocks}
      globalChannel={globalChannelMock}
      i18n={{}}
      i18nConfig={{}}
      logger={{}}
      isMobile={false}
      mountParcel={() => {}}
      singleSpa={{}}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(Base, {});
    });
  });

  it('should display a spinner when is in loading state', async () => {
    const spinnerElement = renderResult.container.querySelector('svg > circle');
    expect(spinnerElement).toBeDefined();
  });
});
