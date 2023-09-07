import * as React from 'react';
import TopbarComponent from '../topbar-component';

import { RenderResult, renderWithAllProviders, act } from '@akashaorg/af-testing';

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
  const BaseComponent = <TopbarComponent />;
  beforeEach(async () => {
    await act(async () => {
      renderResult = await renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render brand name', async () => {
    const brandNode = await renderResult.findByText('AKASHA World');
    expect(brandNode).toBeDefined();
  });
});
