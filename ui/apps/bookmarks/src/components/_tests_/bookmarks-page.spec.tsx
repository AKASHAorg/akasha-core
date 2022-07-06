import * as React from 'react';
import BookmarksPage from '../bookmarks-page';
import { RenderResult, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('<BookmarksPage /> component', () => {
  let renderResult: RenderResult;
  const Base = (
    <BookmarksPage
      logger={null}
      navigateToModal={jest.fn()}
      uiEvents={null}
      layoutConfig={null}
      singleSpa={null}
      worldConfig={null}
      parseQueryString={jest.fn as any}
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
