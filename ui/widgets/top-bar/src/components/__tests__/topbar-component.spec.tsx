import * as React from 'react';
import TopbarComponent from '../topbar-component';

import { RenderResult, renderWithAllProviders, act } from '@akashaorg/af-testing';
import { ReplaySubject } from 'rxjs';

const mockLocationValue = {
  pathname: '/profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router', () =>
  Object.assign(jest.requireActual('react-router'), {
    useLocation: jest.fn().mockImplementation(() => {
      return mockLocationValue;
    }),
  }),
);

describe('<TopbarComponent />', () => {
  let renderResult: RenderResult;
  const BaseComponent = (
    <TopbarComponent
      logger={console as any}
      domElement={document.body}
      uiEvents={new ReplaySubject()}
      layoutConfig={{
        modalSlotId: '',
        pluginSlotId: '',
        topbarSlotId: '',
        rootWidgetSlotId: '',
        widgetSlotId: '',
        sidebarSlotId: '',
      }}
      singleSpa={{} as any}
      name=""
      navigateToModal={jest.fn()}
      worldConfig={{} as any}
      parseQueryString={jest.fn as any}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render brand name', async () => {
    const brandNode = await renderResult.findByText('Ethereum World');
    expect(brandNode).toBeDefined();
  });
});
