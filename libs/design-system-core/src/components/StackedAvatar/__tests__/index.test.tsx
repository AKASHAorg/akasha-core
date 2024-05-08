import * as React from 'react';
import { act } from '@testing-library/react';
import StackedAvatar from '../';
import { customRender } from '../../../test-utils';
import { userData } from '../../../utils/dummy-data';

describe('<StackedAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <StackedAvatar
          userData={userData.map(item => ({ ...item, avatar: item.avatar?.default }))}
          maxAvatars={4}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
