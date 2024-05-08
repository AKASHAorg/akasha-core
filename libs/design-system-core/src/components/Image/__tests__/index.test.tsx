import * as React from 'react';
import { act } from '@testing-library/react';

import Image from '../';
import { customRender } from '../../../test-utils';

describe('<Image /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const src = 'https://placebeard.it/360x360';
  const dataTestId = 'Image-element';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Image src={src} dataTestId={dataTestId} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct src', () => {
    const { getByRole } = componentWrapper;

    const Image = getByRole('img');

    expect(Image).toHaveAttribute('src', src);
  });
});
