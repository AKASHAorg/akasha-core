import * as React from 'react';
import App from '../App';

import { RenderResult, renderWithAllProviders, mockSDK, act } from '@akashaproject/tests';

describe('<App /> component', () => {
  let renderResult: RenderResult;
  const sdkMocks = mockSDK({});
  const BaseComponent = (
    <App
      singleSpa={{}}
      activeWhen={{ path: '/app-center' }}
      mountParcel={jest.fn()}
      rootNodeId=""
      sdkModules={sdkMocks}
      logger={{ error: jest.fn }}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render', async () => {
    const node = await renderResult.findAllByText('App Center Plugin');
    expect(node).toHaveLength(1);
  });
});
