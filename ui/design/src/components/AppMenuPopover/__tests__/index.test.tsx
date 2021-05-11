import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

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
      <div ref={iconRef} data-testid="icon-wrapper">
        <Icon type="eye" onClick={() => setMenuOpen(true)} />
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
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders popover when clicked', () => {
    const { getByTestId, findByText } = componentWrapper;
    const icon = getByTestId('icon-wrapper');
    expect(icon).toBeDefined();

    // perform click action to reveal popover
    fireEvent.click(icon);

    // using findByText which returns a Promise
    const popoverTitle = findByText(/AKASHA feed/i);
    const ENS = findByText(installedAppsData[1].label);
    const ThreeBox = findByText(installedAppsData[1].label);
    const Profile = findByText(installedAppsData[1].label);

    expect(popoverTitle).toBeDefined();
    expect(ENS).toBeDefined();
    expect(ThreeBox).toBeDefined();
    expect(Profile).toBeDefined();
  });
});
