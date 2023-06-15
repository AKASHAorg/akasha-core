import * as React from 'react';
import { act } from '@testing-library/react';
import CopyToClipboard from '../';
import { customRender } from '../../../test-utils';

describe('<CopyToClipboard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const text = 'value';

  const content = (
    <>
      <p>{text}</p>
      <p>{text}</p>
    </>
  );

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <CopyToClipboard value={text}>{content}</CopyToClipboard>,
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

  it('has correct content', () => {
    const { getAllByText } = componentWrapper;

    const contents = getAllByText(text);

    expect(contents).toBeDefined();
    expect(contents).toHaveLength(2);
  });
});
