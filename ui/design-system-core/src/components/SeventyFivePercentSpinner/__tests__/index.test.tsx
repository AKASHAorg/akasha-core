import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import SeventyFivePercentSpinner from '../';
import { customRender } from '../../../test-utils';

describe('<SeventyFivePercentSpinner /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const loadingLabel = 'Loading...';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <SeventyFivePercentSpinner size="xl" loadingLabel={loadingLabel} />,
        {},
      );
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

  it('has correct loading label', () => {
    const { getByText } = componentWrapper;

    const loading = getByText(loadingLabel);

    expect(loading).toBeDefined();
  });
});
