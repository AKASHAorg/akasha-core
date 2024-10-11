import * as React from 'react';
import { act } from '@testing-library/react';
import Section from '../';
import { customRender } from '../../../test-utils';

describe('<Section /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const blockTitle = 'Section title';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<Section title={blockTitle} />, {});
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

    expect(found).toBeInTheDocument();
  });
});
