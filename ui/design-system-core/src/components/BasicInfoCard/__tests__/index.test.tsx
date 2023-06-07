import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import BasicInfoCard from '../';
import { customRender } from '../../../test-utils';

const titleLabel = 'title';
const subtitleLabel = 'Subtitle';

describe('<BasicInfoCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <BasicInfoCard titleLabel={titleLabel} subtitleLabel={subtitleLabel} />,
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

  it('renders correct title and subtitle', () => {
    const { getByText } = componentWrapper;
    const title = getByText(titleLabel);
    const subtitle = getByText(subtitleLabel);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });
});
