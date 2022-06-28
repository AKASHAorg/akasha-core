import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ChatArea from '..';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ChatArea /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<ChatArea headerElement={<></>} bodyElement={<></>} editorElement={<></>} />),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
