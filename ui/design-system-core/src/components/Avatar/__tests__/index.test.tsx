import * as React from 'react';
import { act } from '@testing-library/react';
import Avatar from '../';
import { customRender } from '../../../test-utils';

describe('<Avatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const avatar = {
    height: 320,
    src: '',
    width: 320,
  };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Avatar avatar={avatar} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders avatar fallback', () => {
    const { getByRole } = componentWrapper;

    const img = getByRole('img');

    expect(img).toBeDefined();
    expect(img).toHaveAttribute('src', expect.stringMatching(/avatar-/));
  });
});
