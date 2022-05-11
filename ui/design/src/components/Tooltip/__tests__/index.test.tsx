import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Tooltip from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import Icon from '../../Icon';

describe('<Tooltip /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Tooltip data-testId="tooltip" message="tooltip message" caretPosition="top">
            <Icon size="sm" type="editSimple" clickable={false} />
          </Tooltip>,
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
