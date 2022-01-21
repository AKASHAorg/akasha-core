import * as React from 'react';
import TopbarComponent from '../topbar-component';

import { RenderResult, renderWithAllProviders, act } from '@akashaproject/ui-awf-testing-utils';
import { BehaviorSubject } from 'rxjs';

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
      getMenuItems={jest.fn().mockImplementation(() => [])}
      logger={{}}
      domElement={document.body}
      uiEvents={new BehaviorSubject({})}
      isMobile={false}
      layoutConfig={{
        modalSlotId: '',
        pluginSlotId: '',
        topbarSlotId: '',
        rootWidgetSlotId: '',
        widgetSlotId: '',
        sidebarSlotId: '',
      }}
      mountParcel={() => {
        /*  */
      }}
      singleSpa={{}}
      name=""
      navigateToModal={jest.fn()}
      activeModal={null}
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
