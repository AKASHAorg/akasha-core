import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppMenuPopover from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { installedAppsData } from '../../../utils/dummy-data';
import { Box } from 'grommet';
import Icon from '../../Icon';

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
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders popover when clicked', () => {
    const { getByTestId, getByText } = componentWrapper;
    const icon = getByTestId('eye-icon');
    expect(icon).toBeDefined();

    // perform click action to reveal popover
    userEvent.click(icon);

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
