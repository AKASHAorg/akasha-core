import * as React from 'react';
import { act } from '@testing-library/react';
import InfoCard from '../';
import { customRender } from '../../../test-utils';

describe('<InfoCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const title = 'Title';
  const body = 'Subtitle';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<InfoCard titleLabel={title} bodyLabel={body} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText(title);
    const bodyLabel = getByText(body);

    expect(titleLabel).toBeDefined();
    expect(bodyLabel).toBeDefined();
  });
});
