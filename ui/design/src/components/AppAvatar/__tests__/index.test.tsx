import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import AppAvatar from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<AppAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<AppAvatar ethAddress={'0x01230123450012312'} sidebarApp={true} />),
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
