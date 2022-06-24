import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MessageAppConvoArea from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MessageAppConvoArea /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppConvoArea headerElement={<></>} bodyElement={<></>} editorElement={<></>} />,
        ),
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
