import * as React from 'react';
import BookmarksPage from '../bookmarks-page';
import { RenderResult, renderWithAllProviders, act } from '@akashaproject/ui-awf-testing-utils';

describe('<BookmarksPage /> component', () => {
  let renderResult: RenderResult;
  const Base = (
    <BookmarksPage
      i18n={null}
      logger={null}
      isMobile={false}
      activeModal={null}
      navigateToModal={jest.fn()}
      uiEvents={null}
      layoutConfig={null}
      mountParcel={() => {
        /*  */
      }}
      singleSpa={null}
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
