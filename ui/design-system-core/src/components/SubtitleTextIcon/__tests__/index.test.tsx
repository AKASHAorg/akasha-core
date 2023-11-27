import * as React from 'react';
import { act } from '@testing-library/react';
import SubtitleTextIcon from '../';
import { Akasha } from '../../Icon/akasha-icons';
import { customRender } from '../../../test-utils';

describe('<SubtitleTextIcon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const label = 'Text';
  const subtitle = 'Some text';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <SubtitleTextIcon label={label} subtitle={subtitle} icon={<Akasha />} solid={true} />,
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

  it('has correct label and subtitle', () => {
    const { getByText } = componentWrapper;

    const text = getByText(label);
    const subtext = getByText(subtitle);

    expect(text).toBeDefined();
    expect(subtext).toBeDefined();
  });
});
