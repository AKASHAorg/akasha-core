import * as React from 'react';
import { act } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import BasicCardBox from '../';

const label = 'Card content';
const CardContent = (
  <>
    <div>{label}</div>
    <div>{label}</div>
    <div>{label}</div>
  </>
);

describe('<BasicCardBox /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<BasicCardBox> {CardContent}</BasicCardBox>, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders children correctly', () => {
    const { getAllByText } = componentWrapper;
    const childDiv = getAllByText(label);
    expect(childDiv).toBeDefined();
    expect(childDiv.length).toEqual(3);
  });
});
