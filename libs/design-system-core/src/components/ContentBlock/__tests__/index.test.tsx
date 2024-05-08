import * as React from 'react';
import { act } from '@testing-library/react';
import ContentBlock from '../';
import { customRender } from '../../../test-utils';

describe('<ContentBlock /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const blockTitle = 'Block title';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<ContentBlock blockTitle={blockTitle} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct block title', () => {
    const { getByText } = componentWrapper;

    const found = getByText(blockTitle);

    expect(found).toBeDefined();
  });
});
