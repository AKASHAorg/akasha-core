import * as React from 'react';
import { useViewportSize } from '../../Providers/viewport-dimension';
import { Sidebar, SidebarMobile } from '../index';
import { ISidebarProps } from './sidebar';

const ResponsiveSidebar: React.FC<ISidebarProps> = props => {
  const {
    loggedEthAddress,
    allMenuItems,
    headerMenuItems,
    bodyMenuItems,
    footerMenuItems,
    onClickMenuItem,
    onClickCloseSidebar,
    searchLabel,
    appCenterLabel,
    currentRoute,
  } = props;
  const { size } = useViewportSize();

  return (
    <>
      {size === 'small' ? (
        <SidebarMobile
          onClickMenuItem={onClickMenuItem}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          allMenuItems={allMenuItems}
          headerMenuItems={headerMenuItems}
          bodyMenuItems={bodyMenuItems}
          footerMenuItems={footerMenuItems}
          loggedEthAddress={loggedEthAddress}
          currentRoute={currentRoute}
        />
      ) : (
        <Sidebar
          onClickMenuItem={onClickMenuItem}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          allMenuItems={allMenuItems}
          headerMenuItems={headerMenuItems}
          bodyMenuItems={bodyMenuItems}
          footerMenuItems={footerMenuItems}
          loggedEthAddress={loggedEthAddress}
          currentRoute={currentRoute}
        />
      )}
    </>
  );
};

export { ResponsiveSidebar };
