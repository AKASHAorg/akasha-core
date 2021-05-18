import * as React from 'react';
import { Box } from 'grommet';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppMenuPopover from '../index';
import Icon from '../../Icon';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { installedAppsData } from '../../../utils/dummy-data';

const BaseComponent = () => {
  const iconRef = React.useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Box width="medium" pad={{ top: 'large' }}>
      <div ref={iconRef}>
        <Icon type="eye" testId="eye-icon" onClick={() => setMenuOpen(true)} />
      </div>
      {iconRef?.current && menuOpen && (
        <AppMenuPopover
          menuItem={{
            ...installedAppsData[0],
            subRoutes: [installedAppsData[1], installedAppsData[2], installedAppsData[3]],
          }}
          target={iconRef.current}
          closePopover={() => setMenuOpen(false)}
          onClickMenuItem={() => null}
        />
      )}
    </Box>
  );
};

describe('<AppMenuPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<BaseComponent />), {});
    });

    /* this block of code is specific to modals and popovers
      that will be rendered after an icon is clicked */

    const { getByTestId } = componentWrapper;
    const icon = getByTestId('eye-icon');
    // perform click action to reveal popover
    userEvent.click(icon);
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders popover when clicked', () => {
    const { getByText } = componentWrapper;

    const popoverTitle = getByText(installedAppsData[0].label);
    const ENS = getByText(installedAppsData[1].label);
    const ThreeBox = getByText(installedAppsData[2].label);
    const Profile = getByText(installedAppsData[3].label);

    expect(popoverTitle).toBeDefined();
    expect(ENS).toBeDefined();
    expect(ThreeBox).toBeDefined();
    expect(Profile).toBeDefined();
  });
});
