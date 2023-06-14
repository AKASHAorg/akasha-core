import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import StackedAvatar from '../';
import { customRender } from '../../../test-utils';
import { userData } from '../../../utils/dummy-data';

describe('<StackedAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<StackedAvatar userData={userData} maxAvatars={4} />, {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
