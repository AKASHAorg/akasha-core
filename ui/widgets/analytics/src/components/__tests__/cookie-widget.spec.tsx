import * as React from 'react';
import CookieWidget from '../cookie-widget';

import { RenderResult, renderWithAllProviders } from '@akashaorg/af-testing';

describe('< CookieWidget />', () => {
  let renderResult: RenderResult;
  const BaseComponent = <CookieWidget />;
  beforeEach(() => {
    renderResult = renderWithAllProviders(BaseComponent, {});
  });
  it('should render 2 buttons - `Accept all`, `Only essential`', async () => {
    const acceptButton = await renderResult.findByText('Accept all');
    const essentialButton = await renderResult.findByText('Only essential');
    expect(acceptButton).toBeDefined();
    expect(essentialButton).toBeDefined();
  });
});
