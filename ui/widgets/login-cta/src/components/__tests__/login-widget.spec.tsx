import * as React from 'react';
import LoginCTAWidget from '../login-widget-cta';

import { RenderResult, renderWithAllProviders, act } from '@akashaproject/ui-awf-testing-utils';

describe('<LoginWidget />', () => {
  let renderResult: RenderResult;
  const BaseComponent = <LoginCTAWidget />;
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
