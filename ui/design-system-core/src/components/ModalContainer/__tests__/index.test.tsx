import * as React from 'react';
import { act } from '@testing-library/react';
import ModalContainer from '../';
import { customRender } from '../../../test-utils';

describe('<ModalContainer /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const content = (
    <>
      <p>content 1</p>
      <p>content 2</p>
    </>
  );

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<ModalContainer>{content}</ModalContainer>, {});
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

    const childNodes = getAllByText(/content/);

    expect(childNodes).toBeDefined();
    expect(childNodes).toHaveLength(2);
  });
});
