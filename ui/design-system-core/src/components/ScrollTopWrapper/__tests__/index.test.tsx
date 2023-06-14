import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import ScrollTopWrapper from '../';
import { customRender } from '../../../test-utils';

describe('<ScrollTopWrapper /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const content = (
    <>
      <p>Hello world</p>
    </>
  );

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ScrollTopWrapper placement="left">{content}</ScrollTopWrapper>,
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
});
