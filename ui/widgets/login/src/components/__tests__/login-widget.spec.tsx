import * as React from 'react';
import LoginWidget from '../login-widget';

import { RenderResult, renderWithAllProviders, act } from '@akashaproject/ui-awf-testing-utils';

describe('<LoginWidget />', () => {
  let renderResult: RenderResult;
  const BaseComponent = <LoginWidget />;
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should have a `write to us link`', async () => {
    const linkNode = await renderResult.findByText('write to us');
    expect(linkNode).toBeDefined();
  });
});
