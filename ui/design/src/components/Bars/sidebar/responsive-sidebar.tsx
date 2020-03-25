import * as React from 'react';
import { useViewportSize } from '../../Providers/viewport-dimension';
import { Sidebar, SidebarMobile } from '../index';
import { ISidebarProps } from './sidebar';

const ResponsiveSidebar: React.FC<ISidebarProps> = props => {
  const {
    loggedEthAddress,
    menuItems,
    onClickAddApp,
    onClickMenuItem,
    onClickSearch,
    onClickCloseSidebar,
    searchLabel,
    appCenterLabel,
  } = props;
  const { size } = useViewportSize();

  return (
    <>
      {size === 'small' ? (
        <SidebarMobile
          onClickAddApp={onClickAddApp}
          onClickMenuItem={onClickMenuItem}
          onClickSearch={onClickSearch}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          menuItems={menuItems}
          loggedEthAddress={loggedEthAddress}
        />
      ) : (
        <Sidebar
          onClickAddApp={onClickAddApp}
          onClickMenuItem={onClickMenuItem}
          onClickSearch={onClickSearch}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          menuItems={menuItems}
          loggedEthAddress={loggedEthAddress}
        />
      )}
    </>
  );
};

export { ResponsiveSidebar };
